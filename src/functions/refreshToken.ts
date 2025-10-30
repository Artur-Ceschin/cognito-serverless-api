import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { InitiateAuthCommand, NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken } = bodyParser(event.body);
    if (!refreshToken) {
      return response(400, { message: 'refreshToken is required' });
    }

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);
    if (!AuthenticationResult?.AccessToken) {
      return response(400, { message: 'Invalid refresh token' });
    }

    const { AccessToken } = AuthenticationResult;

    return response(200, {
      accessToken: AccessToken,
    });
  } catch (error) {
    if (error instanceof NotAuthorizedException) {
      return response(400, { message: 'Invalid or expired refresh token' });
    }
    return response(500, { message: 'Internal server error' });
  }
}
