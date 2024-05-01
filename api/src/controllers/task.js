const express = require("express");
const passport = require("passport");
const router = express.Router();
const { capture } = require("../sentry");
const SERVER_ERROR = "SERVER_ERROR";
const TaskModel = require("../models/task");

router.post("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    // to add some checks
    const obj = {};

    if (req.body.hasOwnProperty("title")) obj.title = req.body.title;
    if (req.body.hasOwnProperty("category")) obj.category = req.body.category;
    if (req.body.hasOwnProperty("projectId")) obj.projectId = req.body.projectId;
    if (req.body.hasOwnProperty("projectName")) obj.projectName = req.body.projectName;
    if (req.body.hasOwnProperty("projectCategory")) obj.projectCategory = req.body.projectCategory;
    if (req.body.hasOwnProperty("assignedId")) obj.assignedId = req.body.assignedId;
    if (req.body.hasOwnProperty("assignedName")) obj.assignedName = req.body.assignedName;
    if (req.body.hasOwnProperty("assignedAvatar")) obj.assignedAvatar = req.body.assignedAvatar;
    if (req.body.hasOwnProperty("status")) obj.status = req.body.status;
    if (req.body.hasOwnProperty("notes")) obj.notes = req.body.notes;
    if (req.body.hasOwnProperty("startsAt")) obj.startsAt = req.body.startsAt;
    if (req.body.hasOwnProperty("endsAt")) obj.endsAt = req.body.endsAt;

    obj.workspace_id = req.user.workspace_id;
    obj.workspace_name = req.user.workspace_name;

    const data = await TaskModel.create(obj);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/weekly", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const firstDayOfWeek = new Date(req.query.date);
    const lastDayOfWeek = new Date(req.query.date);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    const data = await TaskModel.find({
      $or: [
        { startsAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek } }, // Task starts within the week
        { endsAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek } }, // Task ends within the week
        {
          $and: [
            // Task spans across the week
            { startsAt: { $lt: firstDayOfWeek } },
            { endsAt: { $gt: lastDayOfWeek } },
          ],
        },
      ],
      workspace_id: req.user.workspace_id,
    });

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    console.log(error);
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TaskModel.findById(id);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const query = req.query;
    query.workspace_id = req.user.workspace_id;

    if (query.assignedTo) {
      if (query.assignedTo === "Moi") {
        query.assignedId = req.user._id;
        delete query.assignedTo;
      } else {
        delete query.assignedTo;
      }
    }

    if (query.assignedId === "all") delete query.assignedId;

    if (query.projectId === "all") delete query.projectId;

    const data = await TaskModel.find(query).sort({ createdAt: -1 }).limit(100);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.get("/public/:id", async (req, res) => {
  try {
    const query = req.query;
    query.projectId = req.params.id;

    const data = await TaskModel.find(query).sort({ createdAt: -1 }).limit(100);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.put("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const obj = {};

    if (req.body.hasOwnProperty("title")) obj.title = req.body.title;
    if (req.body.hasOwnProperty("category")) obj.category = req.body.category;
    if (req.body.hasOwnProperty("projectId")) obj.projectId = req.body.projectId;
    if (req.body.hasOwnProperty("projectName")) obj.projectName = req.body.projectName;
    if (req.body.hasOwnProperty("projectCategory")) obj.projectCategory = req.body.projectCategory;
    if (req.body.hasOwnProperty("assignedId")) obj.assignedId = req.body.assignedId;
    if (req.body.hasOwnProperty("assignedName")) obj.assignedName = req.body.assignedName;
    if (req.body.hasOwnProperty("assignedAvatar")) obj.assignedAvatar = req.body.assignedAvatar;
    if (req.body.hasOwnProperty("status")) obj.status = req.body.status;
    if (req.body.hasOwnProperty("notes")) obj.notes = req.body.notes;
    if (req.body.hasOwnProperty("startsAt")) obj.startsAt = req.body.startsAt;
    if (req.body.hasOwnProperty("endsAt")) obj.endsAt = req.body.endsAt;
    if (req.body.hasOwnProperty("delta")) {
      const data = await TaskModel.findById(id);
      const deltaMilliseconds = req.body.delta.years * 31536000000 + req.body.delta.months * 2592000000 + req.body.delta.days * 86400000 + req.body.delta.milliseconds;
      obj.startsAt = new Date(new Date(data.startsAt).getTime() + deltaMilliseconds);
      obj.endsAt = new Date(new Date(data.endsAt).getTime() + deltaMilliseconds);
    }

    const data = await TaskModel.findByIdAndUpdate(id, obj, { new: true });

    res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    await TaskModel.findByIdAndDelete(id);
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
