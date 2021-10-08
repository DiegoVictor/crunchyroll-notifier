import type { AWS } from "@serverless/typescript";

import rss from "@functions/rss";

const serverlessConfiguration: AWS = {
  service: "crunchyroll-notifier",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      EXECUTION_INTERVAL_MINUTES: "15",
      LOCALSTACK_ENDPOINT: "http://localhost:4566",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { rss },
};

module.exports = serverlessConfiguration;
