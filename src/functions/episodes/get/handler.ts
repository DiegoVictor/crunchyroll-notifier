import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@libs/response";
export const get = async (event: APIGatewayProxyEvent) => {
  const { date = new Date() } = event.queryStringParameters || {};

  try {
    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
