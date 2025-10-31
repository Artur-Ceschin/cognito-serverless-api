import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import {
  ConfirmForgotPasswordCommand,
  UserNotFoundException,
  CodeMismatchException,
  ExpiredCodeException,
  InvalidPasswordException,
  LimitExceededException,
  NotAuthorizedException
} from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, code, newPassword } = bodyParser(event.body);

    if (!email || !code || !newPassword) {
      return response(400, { message: 'email, code, and newPassword are required' });
    }

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return response(400, { message: 'User not found' });
    }
    if (error instanceof CodeMismatchException) {
      return response(400, { message: 'Invalid verification code' });
    }
    if (error instanceof ExpiredCodeException) {
      return response(400, { message: 'Verification code has expired' });
    }
    if (error instanceof InvalidPasswordException) {
      return response(400, { message: 'Password does not meet requirements' });
    }
    if (error instanceof LimitExceededException) {
      return response(400, { message: 'Too many attempts. Please try again later' });
    }
    if (error instanceof NotAuthorizedException) {
      return response(400, { message: 'Not authorized to perform this action' });
    }
    return response(500, { message: 'Internal server error' });
  }
}
