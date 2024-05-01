const express = require("express");
const passport = require("passport");
const router = express.Router();

const { capture } = require("../sentry");

const WorkspaceObject = require("../models/workspace");
const { slugify } = require("../utils");

const SERVER_ERROR = "SERVER_ERROR";

router.post("/", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  try {
    const body = req.body;
    body.slug = slugify(req.body.name);

    const data = await WorkspaceObject.create(body);
    await data.save();

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = req.query;
    const data = await WorkspaceObject.find(query);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await WorkspaceObject.findOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.put("/:id", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  try {
    const obj = req.body;
    const data = await WorkspaceObject.findByIdAndUpdate(req.params.id, obj, { new: true });
    res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  try {
    await WorkspaceObject.findByIdAndRemove(req.params.id);
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
