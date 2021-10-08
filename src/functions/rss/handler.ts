import "source-map-support/register";

import { APIGatewayProxyEvent } from "aws-lambda";
const rss = async (event: APIGatewayProxyEvent) => {
};

export const main = middyfy(rss);
