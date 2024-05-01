const mongoose = require("mongoose");

const MODELNAME = "freelance_request";

const Schema = new mongoose.Schema({
  description: { type: String },
  budget: { type: String },
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },

  workspace_id: { type: String, required: true },
  workspace_name: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
