const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const config = require('./config');

const db = {

  getApplicationVersion: (id, date) => {
    let item = utils.itemQuery({
      application_reference: id,
      submission_date: date
    });
    return dynamo.get(item).promise();
  },

  getApplication: async (id, params) => {
    if (params.version) {
      return db.getApplicationVersion(id, params.version);
    }

    params = {
      ExpressionAttributeValues: { ':ref': id },
      KeyConditionExpression: 'application_reference = :ref',
      TableName: config.dynamoTable
    };
    let application = await dynamo.query(params).promise;
    return utils.lastItem(application);
  },

  getApplications: (params) => {
    if (params.date) {
      return this.getApplicationsByDate(params.date, params.filters);
    } else {
      return this.getApplicationsByProvider(params.provider, params.filters);
    }

    // group applications by application ref?
  },

  getApplicationsByDate: (date, filters) => {
    let params = {
      ExpressionAttributeValues: { ':date': date },
      KeyConditionExpression: 'submission_date = :date',
      TableName: config.dynamoTable
    };

    if (filters) {
      params = utils.filterParameters(params, filters);
    }

    return dynamo.query(params).promise;
  },

  getApplicationsByProvider: (provider, filters) => {
    let params = {
      ExpressionAttributeValues: { ':provider': provider },
      KeyConditionExpression: 'provider = :provider',
      IndexName: 'provider-index',
      TableName: config.dynamoTable
    };

    if (filters) {
      params = utils.filterParameters(params, filters);
    }

    return dynamo.query(params).promise;
  },

  utils
};

const utils = {
  itemQuery: (key) => { return { TableName: config.dynamoTable, Key: { key } } },
  lastItem: (data) => { return { Item: data.Items.pop() } },
  filterParameters: (params, filters) => {
    Object.entries(filters).forEach(([key, value]) => {
      params.FilterExpression = key + " = :" + key;
      params.ExpressionAttributeValues[':' + key] = value;
    });
    return params;
  }
};

module.exports = db;
