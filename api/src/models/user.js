const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MODELNAME = "user";

const Schema = new mongoose.Schema({
  name: { type: String, trim: true },

  email: { type: String, required: true, unique: true, trim: true },

  workspace_id: { type: String },
  workspace_name: { type: String },

  avatar: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },

  password: String,

  status: { type: String, enum: ["PENDING", "ACCEPTED", "REFUSED"], default: "PENDING" },

  invitation_token: { type: String },
  invitation_expires: { type: Date },

  role: { type: String, enum: ["admin", "normal"], default: "normal" },
  language: { type: String, enum: ["fr", "en"], default: "fr" },

  last_login_at: { type: Date, default: Date.now },
  registered_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

Schema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt.hash(this.password, 10, (e, hash) => {
      this.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

Schema.methods.comparePassword = function (p) {
  return bcrypt.compare(p, this.password || "");
};
const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
