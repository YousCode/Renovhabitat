const express = require("express");
const passport = require("passport");
const router = express.Router();

const { capture } = require("../sentry");

const CommentObject = require("../models/comment");

const SERVER_ERROR = "SERVER_ERROR";


router.post("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const obj = {};

    if (req.body.project_id) obj.project_id = req.body.project_id;
    if (req.body.message) obj.message = req.body.message;

    obj.user_id = req.user._id;
    obj.user_name = req.user.name;

    const data = await CommentObject.create(obj);

    await data.save();

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});


router.get("/", passport.authenticate(["user"], { session: false }), async (req, res) => {
    try {
      const query = req.query;
      const data = await CommentObject.find(query);
      return res.status(200).send({ ok: true, data });
    } catch (error) {
      capture(error);
      res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
  });


router.get("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const data = await CommentObject.findOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.put("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    const new_obj = {};

    if (req.body.project_id) new_obj.project_id = req.body.project_id;
    if (req.body.message) new_obj.message = req.body.message;

    new_obj.user_id = req.user._id;
    new_obj.user_name = req.user.name;

    const data = await CommentObject.findByIdAndUpdate(req.params.id, new_obj, { new: true });

    await data.save();

    res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["user"], { session: false }), async (req, res) => {
  try {
    await CommentObject.findByIdAndRemove(req.params.id);
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
