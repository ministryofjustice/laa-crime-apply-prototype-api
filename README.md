# laa-crime-apply-prototype-api

A prototype API that supports storage of applications for criminal legal aid.

The API is powered by Amazon API Gateway, AWS Lambda and Amazon DynamoDB. Involved resources are defined and provisioned using AWS SAM.

Test from https://crime-apply-api.s3.eu-west-2.amazonaws.com/index.html.

## Components

* API - see `/dist/openapi.json` for the API spec. Test from https://crime-apply-api.s3.eu-west-2.amazonaws.com/index.html.
* Lambda functions - see `/aws/lambda` for read and write handlers. The handlers use DynamoDB as a data store.

## Local development

You can run and test the application locally using [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

#### Pre-requisites:
* Node.js 12 or above
* npm 6 or above
* Docker
* AWS CLI and AWS SAM CLI

#### Steps:
a) Setup Docker:
  * Create a network
    ```sh
    docker network create my-network
    ```
  * Run a dynamodb container in it
    ```sh
    docker run -d --network my-network -v "$PWD":/dynamodb_local_db -p 8000:8000 \
    --network-alias=dynamodb --name dynamodb \
    amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
    ```
b) Setup database:
  * Create table
    ```sh
    aws dynamodb create-table --cli-input-yaml file://./aws/local-dynamo.yml --endpoint-url http://localhost:8000
    ```
  * Verify table has been created
    ```sh
    aws dynamodb list-tables --endpoint-url http://localhost:8000
    aws dynamodb describe-table --table-name applications-for-criminal-legal-aid-dev --endpoint-url http://localhost:8000
    ```
  * Seed table with test items
    ```sh
    sam local invoke WriteCrimeApplications -e aws/events/dynamo-seed-applications.json --docker-network my-network
    ```
  * Confirm test items were created
    ```sh
    sam local invoke ReadCrimeApplications -e aws/events/api-fetch-applications.json --docker-network my-network
    ```

#### Testing:
a) Invoking Lambda functions directly
* You can test each lambda with dummy [events](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-event):
* Write function:
  ```sh
  sam local invoke WriteCrimeApplications -e aws/events/api-submit-application.json --docker-network my-network
  ```
* Read function:
  ```sh
  sam local invoke ReadCrimeApplications -e aws/events/api-fetch-applications.json --docker-network my-network
  ```
* Set test event data using the `-e` flag and use `-d 5858` to run in [debug mode](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging.html).

b) Making API requests
* You can start a local instance of API gateway to test request/response functionality
  ```sh
  sam local start-api --docker-network my-network
  ```
* Call the API at `http://127.0.0.1:3000/applications` from your browser, postman, curl, etc.


## Deployment
* `dev` - you can deploy manually using SAM cli - (see instructions below)
* `staging` - updates are auto-deployed to `staging` environment on push/merge to `main` branch. See `./github/workflows`.

##### Using SAM to deploy the app

You can use AWS SAM to package and deploy the app manually.

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
