require("dotenv").config(); 

const getEnvironment = () => process.env.ENVIRONMENT || "development";

const environment = getEnvironment();

let MONGO_URL;
if (environment === "production") {
  MONGO_URL = process.env.MONGO_URL_PROD || "mongodb+srv://yous26:o3YCiReZj2ROWUTG@neorenov.mt77wei.mongodb.net/Renovhabitat";
} else {
  MONGO_URL = process.env.MONGO_URL_DEV || "mongodb+srv://yous26:o3YCiReZj2ROWUTG@neorenov.mt77wei.mongodb.net/Renovhabitat";
}

const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: MONGO_URL,
  secret: process.env.SECRET || "not-so-secret",
  APP_URL: environment === "production" ? process.env.APP_URL_PROD || "https://renovhabitat.vercel.app" : process.env.APP_URL_DEV || "http://localhost:8082",
  ADMIN_URL: environment === "production" ? process.env.ADMIN_URL_PROD || "https://admin-renovhabitat.vercel.app" : process.env.ADMIN_URL_DEV || "http://localhost:8083",
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
  ENVIRONMENT: environment
};

module.exports = config;