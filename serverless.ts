import type { AWS } from "@serverless/typescript";

import processRss from "@functions/rss/process";
import processAnimes from "@functions/queue/animes";
import storeAnimes from "@functions/animes/store";
import getActiveAnimes from "@functions/animes/get";

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
    episodesProcessingTopicName: "episodes-processing-${opt:stage}-sns-topic",
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
      QUEUE_URL: {
        Ref: "EpisodesQueue",
      },
      EPISODES_PROCESSING_TOPIC_ARN: {
        Ref: "EpisodesProcessingTopic",
      },
      TOPICS_ARN: "arn:aws:sns:${self:provider.region}:${aws:accountId}",
      GENERAL_TOPIC_ARN: {
        Ref: "GeneralTopic",
      },
      PLATFORM_APPLICATION_ARN:
        "arn:aws:sns:${self:provider.region}:${aws:accountId}:app/GCM/crunchyroll-notifier-${opt:stage}",
      USER_POOL_ID: {
        Ref: "UserPool",
      },
      USER_POOL_CLIENT_ID: {
        Ref: "UserPoolClient",
      },
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamoDB:Scan", "dynamodb:BatchWriteItem"],
        Resource: {
          "Fn::GetAtt": ["AnimesTable", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: [
          "dynamoDB:Scan",
          "dynamodb:BatchWriteItem",
          "dynamoDB:UpdateItem",
        ],
        Resource: {
          "Fn::GetAtt": ["EpisodesTable", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage"],
        Resource: {
          "Fn::GetAtt": ["EpisodesQueue", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: [
          "sns:Publish",
          "sns:CreateTopic",
          "sns:CreatePlatformEndpoint",
          "sns:Subscribe",
          "sns:Unsubscribe",
        ],
        Resource: "arn:aws:sns:${self:provider.region}:${aws:accountId}:*",
      },
      {
        Effect: "Allow",
        Action: ["cognito-idp:AdminInitiateAuth"],
        Resource: {
          "Fn::GetAtt": ["UserPool", "Arn"],
        },
      },
    ],
  },
  package: {
    patterns: ["!tests", "!scripts"],
  },
  functions: {
    processRss,
    storeAnimes,
    processAnimes,
    getActiveAnimes,
  },
  resources: {
    Resources: {
      ApiGatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "BAD_REQUEST_BODY",
          ResponseTemplates: {
            "application/json":
              '{"message":$context.error.messageString,"validation": "$context.error.validationErrorString"}',
          },
        },
      },
      UserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "crunchyroll-notifier-${opt:stage}-user-pool",
          AutoVerifiedAttributes: ["email"],
          UsernameAttributes: ["email"],
        },
      },
      UserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "crunchyroll-notifier-${opt:stage}-user-pool-client",
          ExplicitAuthFlows: [
            "ALLOW_ADMIN_USER_PASSWORD_AUTH",
            "ALLOW_REFRESH_TOKEN_AUTH",
          ],
          GenerateSecret: false,
          UserPoolId: {
            Ref: "UserPool",
          },
        },
      },
      ApiGatewayRestApiAuthorizer: {
        Type: "AWS::ApiGateway::Authorizer",
        Properties: {
          Name: "crunchyroll-notifier-${opt:stage}-authorizer",
          Type: "COGNITO_USER_POOLS",
          IdentitySource: "method.request.header.Authorization",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ProviderARNs: [
            {
              "Fn::GetAtt": ["UserPool", "Arn"],
            },
          ],
        },
      },
      EpisodesQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "episodes-${opt:stage}-sqs",
        },
      },
      AnimesTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Animes",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      EpisodesTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Episodes",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          StreamSpecification: {
            StreamViewType: "NEW_IMAGE",
          },
        },
      },
      EpisodesProcessingTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          DisplayName: "EpisodesProcessing",
          TopicName: "${self:custom.episodesProcessingTopicName}",
        },
      },
      GeneralTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          DisplayName: "General",
          TopicName: "general-${opt:stage}-sns-topic",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
