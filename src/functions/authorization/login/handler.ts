import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
export const login = async (event: APIGatewayProxyEvent) => {
  try {
  } catch (err) {
    return response.InternalServerError();
  }
};
