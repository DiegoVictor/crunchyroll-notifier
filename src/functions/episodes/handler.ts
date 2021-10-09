import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

export const episodes = async (event: APIGatewayProxyEvent) => {
  try {
    const { date = new Date() } = event.queryStringParameters || {};

  } catch (err) {
    console.log(err);

  }
};
