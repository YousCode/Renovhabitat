const forceProd = false;

const environment = getEnvironment();

let apiURL = "";
let appURL = "";

console.log("environment", environment);
if (environment === "development") {
  apiURL = "http://localhost:8080";
  appURL = "http://localhost:8082";
}

if (environment === "production") {
  apiURL = "https://kolab-api.cleverapps.io";
  appURL = "https://kolab-app.cleverapps.io";
}

const SENTRY_URL = "https://1b10c07b6dbfca8fa04ac9cbab4aab83@sentry.selego.co/81";

const hjid = 3641828;
const hjsv = 6;

function getEnvironment() {
  if (window.location.href.indexOf("app-staging") !== -1) return "staging";
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) return "development";
  return "production";
}

export { apiURL, appURL, SENTRY_URL, environment, hjid, hjsv };
