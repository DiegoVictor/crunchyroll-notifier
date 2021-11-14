const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");

const [, , UserPoolId, Username, Password] = process.argv;

const provider = new CognitoIdentityProvider({});

provider
  .adminCreateUser({
    UserPoolId,
    Username,
    TemporaryPassword: Password,
    UserAttributes: [
      {
        Name: "email",
        Value: Username,
      },
      {
        Name: "email_verified",
        Value: "True",
      },
    ],
  })
  .then(() =>
    provider.adminSetUserPassword({
      UserPoolId,
      Permanent: true,
      Username,
      Password,
    })
  )
  .then(() =>
    process.stdout.write("\x1b[32mUser created and confirmed successfully!\n")
  );
