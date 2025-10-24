import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: body.firstName,
        },
        {
          Name: 'family_name',
          Value: body.lastName,
        },
      ],
    })

    const { UserSub } = await cognitoClient.send(command);
    return response(201, { userId: UserSub });
  } catch (error) {
    return response(400, { message: (error as Error).message });
  }
}
