import { randomUUID } from "crypto";
import * as faker from "faker";

import { process } from "@functions/queue/animes/handler";
import { Message } from "@infra/contracts/Message";
import { factory } from "../../../utils/factory";
import { Anime } from "@application/contracts/Anime";
import createEvent from "@serverless/event-mocks";
import { APIGatewayProxyEvent } from "aws-lambda";

const receiveMessages = jest.fn(() => Promise.resolve([]));
jest.mock("@infra/services/queue", () => ({
  receiveMessages: () => receiveMessages(),
}));

const findByTitle = jest.fn((_: string[]) => Promise.resolve([]));
const getFromMessages = jest.fn((_: Message[]) => []);
const saveMany = jest.fn((_: Anime[]) => Promise.resolve([]));
jest.mock("@infra/repositories/animes", () => ({
  getFromMessages: (messages: Message[]) => getFromMessages(messages),
  findByTitle: (titles: string[]) => findByTitle(titles),
  saveMany: (animes: Anime[]) => saveMany(animes),
}));

const getOnlyNewAnimes = jest.fn((_: Anime[], __: Anime[]) => []);
jest.mock("@application/use_cases/getOnlyNewAnimes", () => ({
  getOnlyNewAnimes: (animes: Anime[], saved: Anime[]) =>
    getOnlyNewAnimes(animes, saved),
}));

const createAnimeTopics = jest.fn((_: Anime[]) => Promise.resolve());
jest.mock("@application/use_cases/createAnimeTopics", () => ({
  createAnimeTopics: (animes: Anime[]) => createAnimeTopics(animes),
}));

const activateAnimesWhenNecessary = jest.fn((_: Anime[]) => Promise.resolve());
jest.mock("@application/use_cases/activateAnimesWhenNecessary", () => ({
  activateAnimesWhenNecessary: (animes: Anime[]) =>
    activateAnimesWhenNecessary(animes),
}));

const processEpisodesMessage = jest.fn((_: Message[]) => Promise.resolve());
jest.mock("@infra/services/notification", () => ({
  processEpisodesMessage: (messages: Message[]) =>
    processEpisodesMessage(messages),
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

describe("Store Animes", () => {
  it("should be able to store new animes", async () => {
    const messages = await factory.attrsMany<Message>("Message", 5);
    const animes = messages.map(({ MessageBody: { serie } }) => ({
      id: randomUUID(),
      title: serie,
      active: true,
      topic: serie.replace(/(\W|_)/gi, ""),
    }));

    receiveMessages.mockReturnValue(Promise.resolve(messages));
    getFromMessages.mockReturnValue(animes);
    findByTitle.mockReturnValue(Promise.resolve([]));
    getOnlyNewAnimes.mockReturnValue(animes);

    await process();

    expect(getFromMessages).toHaveBeenCalledWith(messages);
    expect(findByTitle).toHaveBeenCalledWith(animes.map(({ title }) => title));
    expect(getOnlyNewAnimes).toHaveBeenCalledWith(animes, []);
    expect(saveMany).toHaveBeenCalledWith(animes);
    expect(createAnimeTopics).toHaveBeenCalledWith(animes);
    expect(activateAnimesWhenNecessary).not.toHaveBeenCalled();
    expect(NoContent).toHaveBeenCalled();
  });

  it("should be able to store new animes and trigger episodes processing", async () => {
    globalThis.process.env.EPISODES_PROCESSING_TOPIC_ARN =
      faker.datatype.uuid();

    const messages = await factory.attrsMany<Message>("Message", 5);
    const animes = messages.map(({ MessageBody: { serie } }) => ({
      id: randomUUID(),
      title: serie,
      active: true,
      topic: serie.replace(/(\W|_)/gi, ""),
    }));

    receiveMessages.mockReturnValue(Promise.resolve(messages));
    getFromMessages.mockReturnValue(animes);
    findByTitle.mockReturnValue(Promise.resolve([]));
    getOnlyNewAnimes.mockReturnValue(animes);

    await process();

    expect(getFromMessages).toHaveBeenCalledWith(messages);
    expect(findByTitle).toHaveBeenCalledWith(animes.map(({ title }) => title));
    expect(getOnlyNewAnimes).toHaveBeenCalledWith(animes, []);
    expect(saveMany).toHaveBeenCalledWith(animes);
    expect(createAnimeTopics).toHaveBeenCalledWith(animes);
    expect(activateAnimesWhenNecessary).not.toHaveBeenCalled();
    expect(processEpisodesMessage).toHaveBeenCalledWith(messages);
    expect(NoContent).toHaveBeenCalled();
  });

  it("should be able to reactivate animes and store new animes", async () => {
    const messages = await factory.attrsMany<Message>("Message", 5);
    const animes = messages.map(({ MessageBody: { serie } }) => ({
      id: randomUUID(),
      title: serie,
      active: true,
      topic: serie.replace(/(\W|_)/gi, ""),
    }));

    const onlyNewAnimes = animes.slice(2);
    const saved = animes.slice(0, 2);

    receiveMessages.mockReturnValue(Promise.resolve(messages));
    getFromMessages.mockReturnValue(animes);
    findByTitle.mockReturnValue(Promise.resolve(saved));
    getOnlyNewAnimes.mockReturnValue(onlyNewAnimes);

    await process();

    expect(getFromMessages).toHaveBeenCalledWith(messages);
    expect(findByTitle).toHaveBeenCalledWith(animes.map(({ title }) => title));
    expect(getOnlyNewAnimes).toHaveBeenCalledWith(animes, saved);
    expect(saveMany).toHaveBeenCalledWith(onlyNewAnimes);
    expect(createAnimeTopics).toHaveBeenCalledWith(onlyNewAnimes);
    expect(activateAnimesWhenNecessary).toHaveBeenCalledWith(saved);
    expect(NoContent).toHaveBeenCalled();
  });

  it("should be able to reactivate animes and store new animes send through request body", async () => {
    const messages = await factory.attrsMany<Message>("Message", 5);
    const animes = messages.map(({ MessageBody: { serie } }) => ({
      id: randomUUID(),
      title: serie,
      active: true,
      topic: serie.replace(/(\W|_)/gi, ""),
    }));

    const onlyNewAnimes = animes.slice(2);
    const saved = animes.slice(0, 2);

    receiveMessages.mockReturnValue(Promise.resolve([]));
    findByTitle.mockReturnValue(Promise.resolve(saved));
    getOnlyNewAnimes.mockReturnValue(onlyNewAnimes);

    await process(
      createEvent("aws:apiGateway", {
        body: JSON.stringify(animes),
      } as APIGatewayProxyEvent)
    );

    expect(getFromMessages).not.toHaveBeenCalled();
    expect(findByTitle).toHaveBeenCalledWith(animes.map(({ title }) => title));
    expect(getOnlyNewAnimes).toHaveBeenCalledWith(animes, saved);
    expect(saveMany).toHaveBeenCalledWith(onlyNewAnimes);
    expect(createAnimeTopics).toHaveBeenCalledWith(onlyNewAnimes);
    expect(activateAnimesWhenNecessary).toHaveBeenCalledWith(saved);
    expect(NoContent).toHaveBeenCalled();
  });

  it("should not be able to get animes from queue", async () => {
    const err = new Error("Test Error");
    receiveMessages.mockImplementationOnce(() => {
      throw err;
    });

    const log = jest.spyOn(console, "log");
    log.mockImplementationOnce(() => {});

    const response = await process();

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
