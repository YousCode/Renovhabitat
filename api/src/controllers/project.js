const express = require("express");
const passport = require("passport");
const router = express.Router();
const { capture } = require("../sentry");
const SERVER_ERROR = "SERVER_ERROR";
const ProjectModel = require("../models/project");

router.post("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {

    const obj = {};

   if (req.body.hasOwnProperty("name")) obj.name = req.body.name;
    if (req.body.hasOwnProperty("leadId")) obj.leadId = req.body.leadId;
    if (req.body.hasOwnProperty("leadName")) obj.leadName = req.body.leadName;
    if (req.body.hasOwnProperty("leadAvatar")) obj.leadAvatar = req.body.leadAvatar;
    if (req.body.hasOwnProperty("leadEmail")) obj.leadEmail = req.body.leadEmail;
    if (req.body.hasOwnProperty("leadPhone")) obj.leadPhone = req.body.leadPhone;
    if (req.body.hasOwnProperty("clientName")) obj.clientName = req.body.clientName;
    if (req.body.hasOwnProperty("clientEmail")) obj.clientEmail = req.body.clientEmail;
    if (req.body.hasOwnProperty("clientPhone")) obj.clientPhone = req.body.clientPhone;
    if (req.body.hasOwnProperty("category")) obj.category = req.body.category;
    if (req.body.hasOwnProperty("productionName")) obj.productionName = req.body.productionName;
    if (req.body.hasOwnProperty("projectChatId")) obj.projectChatId = req.body.projectChatId;
    if (req.body.hasOwnProperty("status")) obj.status = req.body.status;
    if (req.body.hasOwnProperty("startAt")) obj.startAt = req.body.startAt;
    if (req.body.hasOwnProperty("endAt")) obj.endAt = req.body.endAt;

    obj.workspace_id = req.user.workspace_id;
    obj.workspace_name = req.user.workspace_name;

    const data = await ProjectModel.create(obj);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const status = req.query.status || "En cours";
    const data = await ProjectModel.find({ workspace_id: user.workspace_id, status: status });
    return res.status(200).send({ ok: true, data });

  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.get("/totals", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const user = req.user;

    const data = await ProjectModel.aggregate([
      { $match: { workspace_id: user.workspace_id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return res.status(200).send({ ok: true, data });
    
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProjectModel.findById(id);

    if (!data) return res.status(404).send({ ok: false, code: "NOT_FOUND" } );
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.get("/public/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProjectModel.findById(id);

    if (!data) return res.status(404).send({ ok: false, code: "NOT_FOUND" } );

    return res.status(200).send({ ok: true, data });

  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});





router.put("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;

    const data = await ProjectModel.findByIdAndUpdate(id, obj, { new: true })

    res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectModel.findByIdAndDelete(id);
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
