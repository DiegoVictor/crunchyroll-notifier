const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");

const [, , UserPoolId, ClientId, Username, Password] = process.argv;

const provider = new CognitoIdentityProvider({});

provider
  .adminInitiateAuth({
    UserPoolId,
    ClientId,
    AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: Username,
      PASSWORD: Password,
    },
  })
  .then((result) =>
    process.stdout.write(
      `\x1b[32m${JSON.stringify(result.AuthenticationResult, null, 2)}\n`
    )
  );
