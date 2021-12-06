import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
export const login = async (event: APIGatewayProxyEvent) => {
  try {
    const { email, password } = validate.authorization(
      JSON.parse(event.body || "{}")
    );
    const auth = await authenticate(email, password);
  } catch (err) {
    if (err instanceof ZodError) {
      return response.BadRequest<ZodIssue[]>(err.errors);
    }

    console.log(err);

    return response.InternalServerError();
  }
};
