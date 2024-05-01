const forceProd = false;

const environment = getEnvironment();

let apiURL = "";
let appURL = "";
if (environment === "development") {
  apiURL = "http://localhost:8080";  
  appURL = "http://localhost:8082";  
}
if (environment === "production") {
  apiURL = "https://kolab-api.cleverapps.io";
  appURL = "https://kolab-app.cleverapps.io";
}

const SENTRY_URL = "";

function getEnvironment() {
  if (window.location.href.indexOf("app-staging") !== -1) return "staging";
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) return "development";
  return "production";
}

export { apiURL, appURL, SENTRY_URL, environment };
