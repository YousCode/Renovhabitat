const mongoose = require("mongoose");

const MODELNAME = "comment";

const Schema = new mongoose.Schema({
  project_id: String,
  user_id: String,
  user_name: String,

  message: String,

  createdAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
