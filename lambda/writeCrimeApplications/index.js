const validate = require('./validate');
const db = require('./db');
const mapApplication = require('./mapApplication');
const config = require('./config');

exports.handler = async (event) => {
  let body, id, params;
  let statusCode = 200;
  const request = event.requestContext;

  try {
    switch (request.httpMethod) {

      case "POST":
        let data = JSON.parse(event.body);
        let fullSubmit = request.path.includes('/submit');

        let schemaType = (fullSubmit) ? 'strict' : 'tolerant';
        let schema = config.schemas[schemaType]

        let validation = await validate(schema, data);
        if (!validation.pass) {
          statusCode = 422;
          body = validation.errors;
          break;
        }

        let item = mapApplication(data, request);
        await db.create(item);

        body = { id: item.application_reference };
        break;

      case "DELETE":
        id = itemId(event);
        params = event.queryStringParameters;

        if (params.version) {
          await db.delete({
            application_reference: id,
            submission_date: params.version
          });
        } else {
          let versions = await db.get(id);
          await versions.Items.each(db.delete);
        }

        body = `Deleted item ${id}`;
        break;

      case "PUT":
        // 'close' a case: set ttl to +7 years (unless custom ttl set in body of request)
        throw new Error(`Application expiry not yet supported`);

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

const itemId = (event) => event.pathParameters && event.pathParameters.proxy;
