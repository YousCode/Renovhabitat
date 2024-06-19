const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");

const UserObject = require("../models/user");
const WorkspaceObject = require("../models/workspace");

const config = require("../config");

const { capture } = require("../sentry");
const { buildGenericTemplate } = require("../emails");
const { sendEmail, sendTemplate } = require("../sendinblue");
const { validatePassword } = require("../utils");

const SERVER_ERROR = "SERVER_ERROR";
const EMAIL_AND_PASSWORD_REQUIRED = "EMAIL_AND_PASSWORD_REQUIRED";
const EMAIL_OR_PASSWORD_INVALID = "EMAIL_OR_PASSWORD_INVALID";
const USER_NOT_EXISTS = "USER_NOT_EXISTS";
const USER_ALREADY_REGISTERED = "USER_ALREADY_REGISTERED";
const INVITATION_TOKEN_EXPIRED_OR_INVALID = "INVITATION_TOKEN_EXPIRED_OR_INVALID";
const INVITATION_DONE = "INVITATION_DONE";
const ACCOUNT_NOT_APPROVED = "ACCOUNT_NOT_APPROVED";
const WORKSPACE_ID_REQUIRED = "WORKSPACE_ID_REQUIRED";

// 1 year
const COOKIE_MAX_AGE = 31557600000;
const JWT_MAX_AGE = "1y";

router.post("/signin", async (req, res) => {
  let { password, email } = req.body;
  email = (email || "").trim().toLowerCase();

  if (!email || !password) return res.status(400).send({ ok: false, code: "EMAIL_AND_PASSWORD_REQUIRED" });

  try {
    const user = await UserObject.findOne({ email });
    if (!user) return res.status(401).send({ ok: false, code: "USER_NOT_EXISTS" });

    if (user.status !== "ACCEPTED") return res.status(401).send({ ok: false, code: "ACCOUNT_NOT_APPROVED" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).send({ ok: false, code: "EMAIL_OR_PASSWORD_INVALID" });

    user.set({ last_login_at: Date.now() });
    await user.save();

    let cookieOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
    if (config.ENVIRONMENT === "development") {
      cookieOptions = { ...cookieOptions, secure: false, domain: "localhost", sameSite: "Lax" };
    } else {
      cookieOptions = { ...cookieOptions, secure: true, origin: "https://kolab-api.cleverapps.io", sameSite: "none" };
    }

    const token = jwt.sign({ _id: user.id }, config.secret, { expiresIn: JWT_MAX_AGE });
    res.cookie("jwt", token, cookieOptions);

    return res.status(200).send({ ok: true, token, user });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { password, email, name, phone, workspace_id, workspace_name } = req.body;

    if (!workspace_id) return res.status(400).send({ ok: false, code: WORKSPACE_ID_REQUIRED });

    if (password && !validatePassword(password)) return res.status(400).send({ ok: false, user: null, code: PASSWORD_NOT_VALIDATED });

    let user = null;

    user = await UserObject.findOne({ email });

    if (user && user.registered_at) return res.status(400).send({ ok: false, code: USER_ALREADY_REGISTERED });

    if (user) {
      user.set({ password, phone, registered_at: Date.now(), invitation_token: null, invitation_expires: null });
      await user.save();
    } else {
      user = await UserObject.create({
        name,
        email,
        password,
        phone,
        workspace_id,
        workspace_name,
        registered_at: Date.now(),
        status: "ACCEPTED", // TEMP setting it here
      });
    }

    let token = null;
    if (workspace_id) {
      let cookieOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
      if (config.ENVIRONMENT === "development") {
        cookieOptions = { ...cookieOptions, secure: false, domain: "localhost", sameSite: "Lax" };
      } else {
        cookieOptions = { ...cookieOptions, secure: true, origin: "https://kolab-api.cleverapps.io", sameSite: "none" };
      }

      token = jwt.sign({ _id: user._id }, config.secret, { expiresIn: JWT_MAX_AGE });
      res.cookie("jwt", token, cookieOptions);
    }

    return res.status(200).send({ user, token, ok: true });
  } catch (error) {
    console.log("e", error);
    if (error.code === 11000) return res.status(409).send({ ok: false, code: USER_ALREADY_REGISTERED });
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.post("/logout", async (req, res) => {
  try {
    let cookieOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
    if (config.ENVIRONMENT === "development") {
      cookieOptions = { ...cookieOptions, secure: false, domain: "localhost", sameSite: "Lax" };
    } else {
      cookieOptions = { ...cookieOptions, secure: true, sameSite: "none", path: "/" };
    }

    res.clearCookie("jwt", cookieOptions);
    return res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, error });
  }
});

router.post("/invite_user", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const body = {};

    body.email = (req.body.email || "").toLowerCase();

    body.workspace_id = req.user.workspace_id;
    body.workspace_name = req.user.workspace_name;
    if (!req.user.workspace_id) body.workspace_id = req.body.workspace_id; // if its created from the admin
    if (!req.user.workspace_name) body.workspace_name = req.body.workspace_name; // if its created from the admin

    if (req.body.hasOwnProperty("name")) body.name = req.body.name;

    //invitation token
    const invitation_token = crypto.randomBytes(20).toString("hex");
    body.invitation_token = invitation_token;
    body.invitation_expires = Date.now() + 86400000 * 30; // 30 days
    body.status = "ACCEPTED"; // TEMP setting it here

    const user = await UserObject.create(body);
    await user.save();

    let user_name = `${req.user.name}`;
    if (req.user._type === "admin") {
      user_name = "L'équipe Kolab";
    }

    await sendTemplate(44, {
      emailTo: [user.email],
      params: { name: user.name, sender: user_name, workspace_name: user.workspace_name, cta: `${config.APP_URL}/auth/signup/${user.workspace_id}` },
    });

    res.status(200).send({ ok: true, user: user });
  } catch (error) {
    if (error.code === 11000) return res.status(400).send({ ok: false, code: USER_ALREADY_REGISTERED });
    capture(error);
    return res.status(500).send({ ok: false, error, code: SERVER_ERROR });
  }
});

router.post("/invitation_verify", async (req, res) => {
  try {
    const { token } = req.body;

    const user = await UserObject.findOne({ invitation_token: token }).select("+invitation_expires");

    if (!user) return res.status(400).send({ ok: false, code: INVITATION_TOKEN_EXPIRED_OR_INVALID });

    // If user is already registred, lets redirect to signin
    if (user.registered_at) return res.status(400).send({ ok: false, code: INVITATION_DONE });

    // If user has expiration date too late, redirect to not valid
    if (Date.now() > user.invitation_expires) return res.status(400).send({ ok: false, code: INVITATION_TOKEN_EXPIRED_OR_INVALID });

    const { email, name, workspace_id, workspace_name } = user;

    return res.status(200).send({ ok: true, user: { email, name, workspace_id, workspace_name } });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.post("/invitation_retry", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();

    const user = await UserObject.findOne({ email });

    if (!user) return res.status(200).send({ ok: true }); //return res.status(400).send({ ok: false, code: USER_NOT_FOUND });
    if (user.registered_at) return res.status(200).send({ ok: false, code: USER_ALREADY_REGISTERED });

    const workspace = await WorkspaceObject.findById(user.workspace_id);

    const invitation_token = crypto.randomBytes(20).toString("hex");
    user.set({ invitation_token });
    user.set({ invitation_expires: Date.now() + 86400000 * 14 });

    const template = buildGenericTemplate({
      title: `Bonjour ${user.name}`,
      message: `Voici le lien pour activer votre invitation`,
      cta_link: `${config.APP_URL}/auth/signup?token=${invitation_token}&workspace_id=${workspace._id}`,
      cta_title: "ACCEPTER l'INVITATION",
    });

    await sendEmail(template, {
      subject: "Kolab - Votre nouvelle invitation",
      sender: { name: "Kolab", email: "contact@kolab.co" },
      emailTo: [user.email],
      tags: ["invitation_retry"],
    });

    await user.save();
    return res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.get("/signin_token", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { user } = req;
    user.set({ last_login_at: Date.now() });
    const u = await user.save();
    return res.status(200).send({ user, token: req.cookies.jwt, ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.post("/forgot_password", async (req, res) => {
  try {
    const obj = await UserObject.findOne({ email: req.body.email.toLowerCase() });

    if (!obj) return res.status(401).send({ ok: false, code: EMAIL_OR_PASSWORD_INVALID });

    const token = await crypto.randomBytes(20).toString("hex");
    obj.set({ forgot_password_reset_token: token, forgot_password_reset_expires: Date.now() + 7200000 }); //2h
    await obj.save();

    const template = buildGenericTemplate({ title: "Rest password link", cta_title: "Reset", cta_link: `${config.APP_URL}/auth/reset?token=${token}` });

    await sendEmail(template, {
      subject: "Reset projectX password",
      sender: { email: "contact@selego.co" },
      emailTo: [obj.email],
    });

    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.post("/forgot_password_reset", async (req, res) => {
  try {
    const obj = await UserObject.findOne({
      forgot_password_reset_token: req.body.token,
      forgot_password_reset_expires: { $gt: Date.now() },
    });

    if (!obj) return res.status(400).send({ ok: false, code: PASSWORD_TOKEN_EXPIRED_OR_INVALID });

    if (!validatePassword(req.body.password)) return res.status(400).send({ ok: false, code: PASSWORD_NOT_VALIDATED });

    obj.password = req.body.password;
    obj.forgot_password_reset_token = "";
    obj.forgot_password_reset_expires = "";
    await obj.save();
    return res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.post("/reset_password", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const match = await req.user.comparePassword(req.body.password);
    if (!match) {
      return res.status(401).send({ ok: false, code: PASSWORD_INVALID });
    }
    if (req.body.newPassword !== req.body.verifyPassword) {
      return res.status(422).send({ ok: false, code: PASSWORDS_NOT_MATCH });
    }
    if (!validatePassword(req.body.newPassword)) {
      return res.status(400).send({ ok: false, code: PASSWORD_NOT_VALIDATED });
    }
    const obj = await UserObject.findById(req.user._id);

    obj.set({ password: req.body.newPassword });
    await obj.save();
    return res.status(200).send({ ok: true, user: obj });
  } catch (error) {
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await UserObject.findOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/", passport.authenticate(["admin", "user"], { session: false }), async (req, res) => {
  try {
    const query = req.query;
    query.workspace_id = req.user.workspace_id;
    const data = await UserObject.find(query);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.post("/search", passport.authenticate(["admin", "user"], { session: false }), async (req, res) => {
  try {
    let query = {
      workspace_id: req.user.workspace_id,
    };

    if (req.user._type === "admin") {
      delete query.workspace_id;
    }

    const searchValue = req.body.search?.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
    if (req.body.search) {
      query = {
        ...query,
        $or: [{ name: { $regex: searchValue, $options: "i" } }, { email: { $regex: searchValue, $options: "i" } }],
      };
    }

    const no_of_docs_each_page = req.body.per_page || 200;
    const current_page_number = req.body.page - 1 || 0;

    const users = await UserObject.find(query)
      .skip(no_of_docs_each_page * current_page_number)
      .limit(no_of_docs_each_page);
    // .sort(sort);

    const total = await UserObject.countDocuments(query);

    return res.status(200).send({ ok: true, data: users, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

//@check
router.put("/:id", passport.authenticate(["admin", "user"], { session: false }), async (req, res) => {
  try {
    const user = await UserObject.findById(req.params.id);
    const obj = req.body;

    if (req.body.hasOwnProperty("file") && typeof req.body.file !== "string") {
      const base64ContentArray = req.body.file.rawBody.split(",");
      const contentType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
      const extension = req.body.file.name.split(".").pop();
      const buffer = new Buffer(base64ContentArray[1], "base64");
      const url = await uploadToS3FromBuffer(`user/avatar/${req.params.id}.${extension}`, buffer, contentType);
      obj.avatar = url;
    }

    if (req.body.hasOwnProperty("language")) {
      obj.language = req.body.language;
    }

    user.set(obj);
    await user.save();

    res.status(200).send({ ok: true, data: user });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.put("/", passport.authenticate(["admin", "user", "applicant"], { session: false }), async (req, res) => {
  try {
    const obj = req.body;
    const data = await UserObject.findByIdAndUpdate(req.user._id, obj, { new: true });
    res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
