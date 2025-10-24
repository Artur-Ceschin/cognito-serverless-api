import { APIGatewayProxyEventV2 } from "aws-lambda";

type Body = Record<string, any>;

export function bodyParser(body: string | undefined): Body {
  let parsedBody = {}

  try {
    parsedBody = JSON.parse(body ?? '{}');

  } catch {
    throw new Error('Invalid body');
  }
  return parsedBody;
}
