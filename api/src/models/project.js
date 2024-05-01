const mongoose = require("mongoose");

const MODELNAME = "project";

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  leadId: { type: String },
  leadName: { type: String },
  leadAvatar: { type: String },
  leadEmail: { type: String },
  leadPhone: { type: String },
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone: { type: String },
  category: {
    type: String,
    enum: ["CLIP_VIDEO", "COURT_METRAGE", "PUBLICITE", "DOCUMENTAIRE", "REPORTAGE", "SERIE", "INTERVIEW", "FILM_CORPORATE", "MISSION_EXPLORER", "LONG_METRAGE", "OTHER"],
    default: "OTHER",
  },
  productionName: { type: String },
  projectChatId: { type: String },
  status: { type: String, enum: ["En cours", "En attente", "Cloturé"], default: "En cours" },
  startAt: { type: Date },
  endAt: { type: Date },
  workspace_id: { type: String },
  workspace_name: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
