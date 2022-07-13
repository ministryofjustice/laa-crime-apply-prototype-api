const db = require('./db');

exports.handler = async (event) => {
  let body, id, params;
  let statusCode = 200;

  try {
    id = itemId(event);
    params = event.queryStringParameters;

    if (id) {
      // single application
      body = await db.getApplication(id, params);
    } else {
      // set of applications
      body = await db.getApplications(params);
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
