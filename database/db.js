const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const dbConnect = () => {
  mongoose.set('strictQuery', true);

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("connected", () => {
    console.log("DB Connected Successfully!");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("DB Disconnected.")
  });
  mongoose.connection.on("error", () => {
    console.log("Error while connecting to DB ", error.message);
  });
}

module.exports = dbConnect;