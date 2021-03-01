import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

console.log(process.env.USER_POOL_ID, process.env.USER_POOL_CLIENT_ID);

export const {DB, USER_POOL_ID, USER_POOL_CLIENT_ID} = process.env;