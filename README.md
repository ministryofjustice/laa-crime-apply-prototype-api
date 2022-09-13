# laa-crime-apply-prototype-api

A prototype API that supports storage of applications for criminal legal aid.

The API is powered by Amazon API Gateway, AWS Lambda and Amazon DynamoDB. Involved resources are defined and provisioned using AWS SAM.

Test from https://crime-apply-api.s3.eu-west-2.amazonaws.com/index.html.

## API spec

See `/dist/openapi.json` for the API spec.

## Lambda functions for persisting data

The `/aws/lambda` folder includes 2 lambda handlers: one for writing to the data store, one for reading from the data store. The handler uses DynamoDB as a data store.

## Deployment

* You can deploy to `dev` environment using SAM cli - (see instructions below)
* Updates are deployed to the `staging` environment on pushing/merging to `main` branch. See ./github/workflows.

## Using SAM to deploy the app

You can use AWS SAM to package and deploy the app. You will need to install the [AWS SAM cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

* Package your lambda functions and store them in S3.

  ```sh
  sam package --s3-bucket crime-apply-api-dynamo-lambda --s3-prefix sam --output-template-file out.yml
  ```

* Deploy a new version of your app using the artifacts the command above just generated (using dev as the stage, for example)

  ```sh
  sam deploy --template-file out.yml --capabilities CAPABILITY_IAM --guided
  ```
- Follow the promtps, entering stack name, stage name (dev, staging, or production), and the version numbers of the lambda code

See `template.yml` for the SAM template.
