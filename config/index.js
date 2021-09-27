require("dotenv").config();

module.exports = {
  DBL: process.env.DB_LOCAL,
  DB: process.env.MONGO_URI,
  PORT: process.env.APP_PORT,
  SECRET: process.env.APP_SECRET
};