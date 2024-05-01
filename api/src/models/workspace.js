const mongoose = require("mongoose");

const MODELNAME = "workspace";

const Schema = new mongoose.Schema({
  name: { type: String, trim: true },

  logo: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },

  slug: String,

  created_at: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
