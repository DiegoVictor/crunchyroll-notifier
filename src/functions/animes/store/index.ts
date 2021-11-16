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
        authorizer: {
          type: "COGNITO_USER_POOLS",
          authorizerId: {
            Ref: "ApiGatewayRestApiAuthorizer",
          },
        },
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
                  description: {
                    type: "string",
                    title: "description",
                  },
                  image: {
                    type: "string",
                    title: "image url",
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
