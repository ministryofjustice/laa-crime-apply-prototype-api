const dynamoTable = 'applications_crime';
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body, item, id;
  let statusCode = 200;
  const headers = { "Content-Type": "application/json" };
  const request = event.requestContext;

  try {
    switch (request.httpMethod) {
      case "DELETE":
        id = itemId(event);
        item = itemQuery(id);
        await dynamo.delete(item).promise();
        body = `Deleted item ${id}`;
        break;
      case "GET":
        id = itemId(event);
        if (id) {
          item = itemQuery(id);
          body = await dynamo.get(item).promise();
        } else {
          body = await dynamo.scan({ TableName: dynamoTable }).promise();
        }
        break;
      case "POST":
        let requestJSON = JSON.parse(event.body);
        let applicationStatus = 'started';
        //let validator = 'partial' schema
        if (request.path.includes('/submit')) {
          applicationStatus = 'completed';
          // validator = full schema
        }
        // validate against 'partial' schema

        await dynamo
          .put({
            TableName: dynamoTable,
            Item: {
              id: request.requestId, // we safe to use API gateway unique identifier?
              data: requestJSON,
              status: applicationStatus
            }
          })
          .promise();
        body = { id: request.requestId };
        break;
      default:
        throw new Error(`Unsupported route: "${request.path}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return { statusCode, body, headers };
};

const itemId = (event) => event.pathParameters && event.pathParameters.proxy;
const itemQuery = (id) => {
  return { TableName: dynamoTable, Key: { id } }
};
