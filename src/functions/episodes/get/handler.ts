import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

export const get = async (event: APIGatewayProxyEvent) => {
  const { date = new Date() } = event.queryStringParameters || {};

  try {
  } catch (err) {
    return response.InternalServerError(err);
  }
};
