import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(
    `${process.cwd()}/src/functions/queue/animes`
  )}/handler.process`,
  events: [
    {
      http: {
        method: "post",
        path: "animes",
        request: {
          schemas: {
            "application/json": {
              type: "array",
              items: {
                required: ["title", "active"],
                properties: {
                  title: {
                    type: "string",
                    title: "title",
                  },
                  active: {
                    type: "boolean",
                    title: "active",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
};
