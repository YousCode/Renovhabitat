const Sentry = require("@sentry/node");
const { ENVIRONMENT } = require("./config");

if (ENVIRONMENT === "production") {
  Sentry.init({
    dsn: "https://1b10c07b6dbfca8fa04ac9cbab4aab83@sentry.selego.co/81",
    environment: "server",
  });
}

function capture(err) {
  console.log("capture", err);
  if (Sentry && err) {
    console.log("capture", err);
    Sentry.captureException(err);
  }
}

module.exports = {
  capture,
};
