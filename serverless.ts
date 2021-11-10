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
      TOPICS_ARN: "arn:aws:sns:${self:provider.region}:${aws:accountId}",
      GENERAL_TOPIC_ARN: {
        Ref: "GeneralTopic",
      },
      PLATFORM_APPLICATION_ARN:
        "arn:aws:sns:${self:provider.region}:${aws:accountId}:app/GCM/crunchyroll-notifier-${opt:stage}",
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
