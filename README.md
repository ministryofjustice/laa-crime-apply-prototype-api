# laa-crime-apply-prototype-api

Resources for a prototype API that supports applications for criminal legal aid.

Test from https://crime-apply-api.s3.eu-west-2.amazonaws.com/index.html.

## Swagger

See `/dist/openapi.json` for the API spec.

## Swagger docs

The `/dist` folder includes Swagger UI docs for the API.

## Lambda functions for persisting data

The `/lambda` folder includes 2 lambda handlers: one for writing to the data store, one for reading from the data store. The handler uses DynamoDB as a data store.
