const AWS = require("aws-sdk");
const validate = require('./validate');

const dynamo = new AWS.DynamoDB.DocumentClient();
const config = require('./config');

exports.handler = async (event, context) => {
  let body, item, id;
  let statusCode = 200;
  const request = event.requestContext;

  try {
    switch (request.httpMethod) {
      case "DELETE":
        id = utils.itemId(event);
        item = utils.itemQuery(id);
        await dynamo.delete(item).promise();
        body = `Deleted item ${id}`;
        break;
      case "GET":
        id = utils.itemId(event);
        if (id) {
          item = utils.itemQuery(id);
          body = await dynamo.get(item).promise();
        } else {
          body = await dynamo.scan({ TableName: config.dynamoTable }).promise();
        }
        break;
      case "POST":
        let requestJSON = JSON.parse(event.body);
        let submit = request.path.includes('/submit');
        let applicationStatus = submit ? 'completed' : 'started';
        let schema = submit ? config.schemas.strict : config.schemas.tolerant;

        let validation = await validate(schema, requestJSON);
        if (!validation.pass) {
          statusCode = 422;
          body = validation.errors;
          break;
        }

        await dynamo
          .put({
            TableName: config.dynamoTable,
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

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  return { statusCode, body, headers };
};

const utils = {
  itemId: (event) => event.pathParameters && event.pathParameters.proxy,
  itemQuery: (id) => { return { TableName: config.dynamoTable, Key: { id } } }
};
