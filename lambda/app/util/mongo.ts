import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env",
});

let isConnected;

export const connectToDatabase = () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  console.log("=> using new database connection");
  return mongoose.connect(process.env.DB as string).then((db) => {
    isConnected = db.connections[0].readyState;
  });
};