import { cognitoClient } from "@/libs/cognitoClient";
import { response } from "@/utils/response";
import { AdminGetUserCommand, NotAuthorizedException, UserNotFoundException } from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const sub = event.requestContext?.authorizer?.jwt?.claims?.sub as string | undefined;
    if (!sub) {
      return response(401, { message: "Unauthorized" });
    }

    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      return response(500, { message: "Missing COGNITO_USER_POOL_ID" });
    }

    const command = new AdminGetUserCommand({
      Username: sub,
      UserPoolId: userPoolId,
    });

    const { UserAttributes } = await cognitoClient.send(command);

    const attributes = (UserAttributes || []).reduce((acc, attr) => {
      if (attr.Name && attr.Value) {
        acc[attr.Name] = attr.Value;
      }
      return acc;
    }, {} as Record<string, string>);

    const profile = {
      id: attributes.sub || sub,
      first_name: attributes.given_name || "",
      last_name: attributes.family_name || "",
    };

    return response(200, profile);
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return response(404, { message: "User not found" });
    }
    if (error instanceof NotAuthorizedException) {
      return response(401, { message: "Unauthorized" });
    }
    return response(500, { message: "Internal server error" });
  }
}
