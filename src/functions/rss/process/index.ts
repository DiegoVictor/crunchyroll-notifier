import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.process`,
  events: [
    {
      http: {
        method: "get",
        path: "rss/process",
        authorizer: {
          type: "COGNITO_USER_POOLS",
          authorizerId: {
            Ref: "ApiGatewayRestApiAuthorizer",
          },
        },
        request: {
          parameters: {
            querystrings: {
              date: false,
            },
          },
        },
      },
    },
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionIntervalMinutes} minutes)",
      },
    },
  ],
};
