const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const config = require('./config');

module.exports = {

  get: (id) => {
    let params = {
      ExpressionAttributeValues: { ':ref': id },
      KeyConditionExpression: 'application_reference = :ref',
      TableName: config.dynamoTable
    };
    return dynamo.query(params).promise;
  },

  create: (data) => {
    return dynamo
      .put({
        TableName: config.dynamoTable,
        Item: data
      }).promise();
  },

  delete: (item) => {
    let params = {
      TableName: config.dynamoTable,
      Key: {
        application_reference: item.application_reference,
        submission_date: item.submission_date
      }
    };
    return dynamo.delete(params).promise();
  }
};
