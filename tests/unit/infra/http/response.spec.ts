import * as faker from "faker";

import { Anime } from "@application/contracts/Anime";
import {
  BadRequest,
  InternalServerError,
  NoContent,
  OK,
} from "@infra/http/response";
import { factory } from "../../../utils/factory";

describe("Response", () => {
  it("should be able to return a 200 OK", async () => {
    const anime = await factory.attrs<Anime>("Anime");

    expect(OK(anime)).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(anime),
    });
  });

  it("should be able to return a 204 NoContent", async () => {
    expect(NoContent()).toStrictEqual({
      statusCode: 204,
      body: "",
    });
  });

  it("should be able to return a 500 InternalServerError", async () => {
    expect(InternalServerError()).toStrictEqual({
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        message: "Ops! Something goes wrong, try again later",
      }),
    });
  });

  it("should be able to return a 400 BadRequest", async () => {
    const message = faker.lorem.paragraph();
    expect(BadRequest({ message })).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify({
        message,
      }),
    });
  });
});
