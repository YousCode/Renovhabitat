const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MODELNAME = "admin";

const Schema = new mongoose.Schema({
  name: { type: String, trim: true },

  email: { type: String, required: true, unique: true, trim: true },

  avatar: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },

  password: String,

  forgot_password_reset_token: String,
  forgot_password_reset_expires: Date,

  last_login_at: { type: Date, default: Date.now },
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
