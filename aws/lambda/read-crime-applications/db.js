const AWS = require("aws-sdk");
const config = require('./config');
const utils = require('./utils');
const dynamo = new AWS.DynamoDB.DocumentClient(config.dynamoSettings);

const db = {

  getApplicationVersion: (id, date) => {
    let item = utils.itemQuery({
      application_reference: id,
      submission_date: date
    });
    return dynamo.get(item).promise();
  },

  getApplication: (id, params) => {
    if (params.version) {
      return db.getApplicationVersion(id, params.version);
    }

    params = {
      ExpressionAttributeValues: { ':ref': id },
      KeyConditionExpression: 'application_reference = :ref',
      TableName: config.dynamoTable
    };
    return dynamo.query(params).promise();
  },

  getApplications: (params) => {
    if (params.provider) {
      return db.getApplicationsByProvider(params.provider, params.filter);
    }

    if (params.status) {
      return db.getApplicationsByStatus(params.status, params.date, params.filter);
    }

    if (params.date) {
      return db.getApplicationsByMonth(params.date, params.filter);
    }

    return dynamo.scan({ TableName: config.dynamoTable }).promise();

    // group applications by application ref?
  },

  getApplicationsByStatus: (status, date, filters) => {
    let params = {
      ExpressionAttributeValues: { ':status': status },
      KeyConditionExpression: 'application_status = :status',
      IndexName: 'status-index',
      TableName: config.dynamoTable
    };

    if (date) {
      params.ExpressionAttributeValues = { ':status': status, ':date': date };
      params.KeyConditionExpression = 'application_status = :status and begins_with (submission_date, :date)';
    }

    if (filters) {
      params = utils.filterParameters(params, filters);
    }

    return dynamo.query(params).promise();
  },

  getApplicationsByMonth: (date, filters) => {
    let elements = date.split('-');
    let yrMonth = elements[0] + '-' + elements[1];

    let params = {
      ExpressionAttributeValues: { ':month': yrMonth, ':date': date },
      KeyConditionExpression: 'submission_month = :month and begins_with (submission_date, :date)',
      IndexName: 'month-index',
      TableName: config.dynamoTable
    };

    if (filters) {
      params = utils.filterParameters(params, filters);
    }

    return dynamo.query(params).promise();
  },

  getApplicationsByProvider: (provider, filters) => {
    let elements = provider.split('#');
    let firm = decodeURI(elements[0]);

    let params = {
      ExpressionAttributeValues: { ':firm': firm, ':provider': provider },
      KeyConditionExpression: 'provider_firm = :firm and begins_with (provider_reference, :provider)',
      IndexName: 'provider-index',
      TableName: config.dynamoTable
    };

    if (filters) {
      params = utils.filterParameters(params, filters);
    }

    return dynamo.query(params).promise();
  },

  utils
};

module.exports = db;
