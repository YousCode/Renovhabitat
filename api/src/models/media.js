const mongoose = require("mongoose");

const MODELNAME = "media";

const Schema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  extension: String,

  project_id: String,
  project_name: String,

  workspace_id: String,
  workspace_name: String,

  user_id: String,
  user_name: String,

  createdAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
