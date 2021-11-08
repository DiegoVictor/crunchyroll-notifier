import createEvent from "@serverless/event-mocks";

import { Episode } from "@application/contracts/Episode";
import { process } from "@functions/rss/process/handler";
import { factory } from "../../../utils/factory";
import { APIGatewayProxyEvent } from "aws-lambda";

const getRssEpisodesFrom = jest.fn(
  (): Promise<Episode[]> => Promise.resolve([])
);
jest.mock("@application/use_cases/getRssEpisodesFrom", () => ({
  getRssEpisodesFrom: () => getRssEpisodesFrom(),
}));

const addEpisodesInQueue = jest.fn(
  (_: Episode[]): Promise<void> => Promise.resolve()
);
jest.mock("@application/use_cases/addEpisodesInQueue", () => ({
  addEpisodesInQueue: (episodes: Episode[]) => addEpisodesInQueue(episodes),
}));

const NoContent = jest.fn(() => {});
const InternalServerError = jest.fn(() => ({
  statusCode: 500,
  body: JSON.stringify({
    code: 500,
    message: "Ops! Something goes wrong, try again later",
  }),
}));
jest.mock("@infra/http/response", () => ({
  NoContent: () => NoContent(),
  InternalServerError: () => InternalServerError(),
}));

describe("Get Episodes", () => {
  it("should be able to process new episodes from rss", async () => {
    const episodes = await factory.attrsMany<Episode>("Episode", 10);

    getRssEpisodesFrom.mockReturnValue(Promise.resolve(episodes));

    await process(
      createEvent("aws:apiGateway", {
        queryStringParameters: {
          date: new Date().toISOString(),
        },
      } as any)
    );

    expect(addEpisodesInQueue).toHaveBeenCalledWith(episodes);
    expect(NoContent).toHaveBeenCalled();
  });

  it("should be able to check there are no new episodes in the rss", async () => {
    getRssEpisodesFrom.mockReturnValue(Promise.resolve([]));

    await process({} as APIGatewayProxyEvent);

    expect(addEpisodesInQueue).not.toHaveBeenCalled();
    expect(NoContent).toHaveBeenCalled();
  });

  it("should not be able to process new episodes from rss", async () => {
    const err = new Error("Test Error");
    getRssEpisodesFrom.mockImplementationOnce(() => {
      throw err;
    });

    const log = jest.spyOn(console, "log");
    log.mockImplementationOnce(() => {});

    const response = await process(
      createEvent("aws:apiGateway", {} as APIGatewayProxyEvent)
    );

    expect(log).toHaveBeenCalledWith(err);
    expect(InternalServerError).toHaveBeenCalled();
    expect(response).toStrictEqual({
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        message: "Ops! Something goes wrong, try again later",
      }),
    });
  });
});
