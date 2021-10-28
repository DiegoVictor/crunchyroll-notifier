import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { getRssEpisodesFrom } from "@application/use_cases/getRssEpisodesFrom";
import { addEpisodesInQueue } from "@application/use_cases/addEpisodesInQueue";

export const process = async (event: APIGatewayProxyEvent) => {
  const { date = new Date() } = event.queryStringParameters || {};

  try {
    const episodes = await getRssEpisodesFrom(date.toString());
    if (episodes.length > 0) {
      await addEpisodesInQueue(episodes);
    }

    return response.NoContent();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
