require("dotenv").config(); // S'assure que les variables d'environnement du fichier .env sont chargées

const getEnvironment = () => process.env.ENVIRONMENT || "development";

const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/Renovhanbitat",
  secret: process.env.SECRET || "not-so-secret",
  APP_URL: process.env.APP_URL || "http://localhost:8082",
  ADMIN_URL: process.env.ADMIN_URL || "http://localhost:8083",
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY, // La clé API est chargée depuis les variables d'environnement
  ENVIRONMENT: getEnvironment()
};

module.exports = config;
