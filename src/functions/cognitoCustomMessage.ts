import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  try {
    const code = event.request.codeParameter;

    if(event.triggerSource === 'CustomMessage_SignUp') {
      event.response.emailSubject = `Welcome to our app ${event.request.userAttributes?.given_name || ''} ${event.request.userAttributes?.family_name || ''}`;
      event.response.emailMessage = `<h1>Welcome to our app ${event.request.userAttributes?.given_name || ''} ${event.request.userAttributes?.family_name || ''}</h1><p>Thank you for signing up! Your confirmation code is {####}</p>`;
      return event;
    }

    if(event.triggerSource === 'CustomMessage_ForgotPassword') {
      event.response.emailSubject = `Reset your password for our app`;
      event.response.emailMessage = `<h1>Reset your password for our app</h1><br><br><p>Your reset code is {####}</p>`;
      return event;
    }

    event.response.emailSubject = `Confirm your email`;
    event.response.emailMessage = `<h1>Confirm your email</h1><p>Your confirmation code is {####}</p>`;
    return event;
  } catch (error) {
    console.error('Error in cognitoCustomMessage:', error);
    // Return the event unchanged on error, Cognito will use default message
    return event;
  }
}

