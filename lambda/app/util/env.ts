import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const {DB, USER_POOL_ID, USER_POOL_CLIENT_ID} = process.env;