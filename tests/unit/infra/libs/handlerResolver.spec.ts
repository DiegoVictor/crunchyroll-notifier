import { handlerPath } from "@infra/libs/handlerResolver";

describe("handlerResolver", () => {
  it("should be able to resolve function path", async () => {
    const folderName = process.cwd() + "/app/src/functions/test";
    expect(`${handlerPath(folderName)}/handler.test`).toBe(
      `app/src/functions/test/handler.test`
    );
  });
});
