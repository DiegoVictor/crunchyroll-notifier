import type { AWS } from "@serverless/typescript";

import getEpisodes from "@functions/episodes/get";

const serverlessConfiguration: AWS = {
  service: "crunchyroll-notifier",
  frameworkVersion: "2",
  variablesResolutionMode: "20210326",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    executionIntervalMinutes: 30,
  },
  configValidationMode: "error",
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    eventBridge: {
      useCloudFormation: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      EXECUTION_INTERVAL_MINUTES: "${self:custom.executionIntervalMinutes}",
      QUEUE_URL:
        "https://sqs.${self:provider.region}.amazonaws.com/${aws:accountId}/episodes-${opt:stage}-sqs",
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage"],
        Resource: {
          "Fn::GetAtt": ["EpisodesQueue", "Arn"],
        },
      },
    ],
  },
  // import the function via paths
  functions: {
    getEpisodes,
  },
  resources: {
    Resources: {
      EpisodesQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "episodes-${opt:stage}-sqs",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
