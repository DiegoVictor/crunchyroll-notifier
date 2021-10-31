import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
export const process = async (event?: APIGatewayProxyEvent) => {
  try {
    const messages = await receiveMessagesFromQueue();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
