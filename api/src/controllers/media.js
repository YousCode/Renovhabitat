const express = require("express");
const router = express.Router();

const MediaObject = require("../models/media");

const { capture } = require("../sentry");
const { uploadToS3FromBuffer } = require("../s3");

const SERVER_ERROR = "SERVER_ERROR";

router.post("/", async (req, res) => {
  try {
    const obj = {};

    obj.project_id = req.body.project_id;
    obj.project_name = req.body.project_name;
    // obj.workspace_id = req.user.workspace_id;
    // obj.workspace_name = req.user.workspace_name;
    // obj.user_id = req.user._id;
    // obj.user_name = req.user.name;

    if (req.body.rawBody) {
      const base64ContentArray = req.body.rawBody.split(",");
      const contentType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
      const extension = req.body.name.split(".").pop();
      const buffer = new Buffer(base64ContentArray[1], "base64");
      const url = await uploadToS3FromBuffer(`projects/${req.body.project_id}/${req.body.name}`, buffer, contentType);
      obj.url = url;
      obj.name = req.body.name;
      obj.type = contentType;
      obj.extension = extension;
    }

    const data = await MediaObject.create(obj);

    await data.save();

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

// we're calling this routes from the public share page, to be secured later
router.get("/", async (req, res) => {
  try {
    const query = req.query;
    const data = await MediaObject.find(query);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await MediaObject.findOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await MediaObject.findByIdAndRemove(req.params.id);
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
