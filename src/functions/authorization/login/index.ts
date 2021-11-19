import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.login`,
  events: [
    {
      http: {
        method: "post",
        path: "auth/login",
        request: {
          schemas: {
            "application/json": {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  title: "email",
                  pattern: "^[a-zA-Z0-9@._-]+$",
                },
                password: {
                  type: "string",
                  title: "password",
                },
              },
            },
          },
        },
      },
    },
  ],
};
