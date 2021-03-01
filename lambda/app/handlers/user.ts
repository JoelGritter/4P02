import { connectToDatabase } from "../util/mongo";
import fetch from "node-fetch";
global.fetch = fetch;
import { success } from "../util/rest";
import { lambdaWrapper, auth } from "../util/wrappers";


// TODO: A better way to chain maybe? Some sorta options object that's trickled down and a list of callback references
export const get = lambdaWrapper(auth(async (event, user) => {
  return success(user);
}))

export async function post(event, context, callback) {
  await connectToDatabase();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Password sent.",
    }),
  };

  callback(null, response);
}
