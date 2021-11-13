import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ZodError, ZodIssue } from "zod";

import * as response from "@infra/http/response";
import { getRssEpisodesFrom } from "@application/use_cases/getRssEpisodesFrom";
import { addEpisodesInQueue } from "@application/use_cases/addEpisodesInQueue";
import * as validate from "@application/validators/rss";

export const process = async (event: APIGatewayProxyEvent) => {
  try {
    const { date = new Date() } = validate.date(
      event.queryStringParameters || {}
    );

    const episodes = await getRssEpisodesFrom(date.toString());
    if (episodes.length > 0) {
      await addEpisodesInQueue(episodes);
    }

    return response.NoContent();
  } catch (err) {
    if (err instanceof ZodError) {
      return response.BadRequest<ZodIssue[]>(err.errors);
    }

    console.log(err);

    return response.InternalServerError();
  }
};
