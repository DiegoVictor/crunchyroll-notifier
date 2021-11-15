import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const identity = new CognitoIdentityProvider({});

export const authenticate = (email: string, password: string) =>
  identity
    .adminInitiateAuth({
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.USER_POOL_CLIENT_ID,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })
    .then((result) => result.AuthenticationResult);
