const express = require("express");
const passport = require("passport");
const router = express.Router();
const { capture } = require("../sentry");
const SERVER_ERROR = "SERVER_ERROR";
const FreelanceRequestModel = require("../models/freelance_request");

router.post("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {

    const obj = {};

    if (req.body.hasOwnProperty("description")) obj.description = req.body.description;
    if (req.body.hasOwnProperty("budget")) obj.budget = req.body.budget;

    obj.userId = req.user._id;
    obj.userName = req.user.name;
    obj.userEmail = req.user.email;
    obj.workspace_id = req.user.workspace_id;
    obj.workspace_name = req.user.workspace_name;

    console.log("obj", obj);

    const data = await FreelanceRequestModel.create(obj);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.get("/", passport.authenticate(["admin"], { session: false }), async (req, res) => {
    try {
        const data = await FreelanceRequestModel.find();
        return res.status(200).send({ ok: true, data });

    } catch (error) {
        capture(error);
        res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});




module.exports = router;
