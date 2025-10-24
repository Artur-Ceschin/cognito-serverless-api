# Serverless Auth with AWS Cognito

A simple serverless authentication system built with AWS Lambda, Serverless Framework, and AWS Cognito.

## What this does

This project helps you create user accounts using AWS Cognito. Users can sign up with their email and password, and the system handles all the authentication magic behind the scenes.

## How to use

1. **Deploy the app:**

   ```bash
   npm install
   serverless deploy
   ```

2. **Sign up a new user:**
   Send a POST request to your deployed endpoint with:
   ```json
   {
     "email": "user@example.com",
     "password": "YourSecurePassword123!",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```

That's it! The system will create a new user account in AWS Cognito.

## What's included

- User registration endpoint
- Password validation (strong passwords required)
- Email-based usernames
- Automatic user pool and client setup

## Tech stack

- AWS Lambda
- AWS Cognito
- Serverless Framework
- TypeScript
- Node.js

## Getting started

Make sure you have:

- Node.js installed
- AWS CLI configured
- Serverless Framework installed (`npm install -g serverless`)

Then just run `serverless deploy` and you're good to go!
