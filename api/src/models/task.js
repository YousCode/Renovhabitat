const mongoose = require("mongoose");

const MODELNAME = "task";

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "3D",
      "DIRECTION_ARTISTIQUE",
      "ASSISTANAT",
      "ETALONNAGE",
      "MONTAGE",
      "GRAPHISME",
      "GESTION",
      "MOTION",
      "CONFO_POST_ETALO",
      "CONFO_PRE_ETALO",
      "PREPA_PROJET",
      "RECHERCHE",
      "SOUND_DESIGN",
      "VFX",
      "ECRITURE",
      "OTHER",
    ],
    default: "OTHER",
  },
  projectId: { type: String },
  projectName: { type: String },
  projectCategory: { type: String },
  assignedId: { type: String },
  assignedName: { type: String },
  assignedAvatar: { type: String },
  startsAt: { type: Date },
  endsAt: { type: Date },
  notes: { type: String },
  status: { type: String, enum: ["Clôturé", "A faire"], default: "A faire" },

  workspace_id: { type: String },
  workspace_name: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
