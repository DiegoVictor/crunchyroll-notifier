import { APIGatewayProxyEvent, Handler, SNSEvent } from "aws-lambda";

import * as response from "@infra/http/response";
export const process: Handler<SNSEvent | APIGatewayProxyEvent> = async (
  event?
) => {
  try {
    return response.NoContent();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
