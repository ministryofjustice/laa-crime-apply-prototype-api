const config = require('./config');

module.exports = {

  itemQuery: (key) => { return { TableName: config.dynamoTable, Key: { key } } },

  lastItem: (data) => { return { Item: data.Items.pop() } },

  filterParameters: (params, filters) => {
    // format is key:operator=value,
    // eg: applicant_reference:begins_with=smith
    filters = filters.split(';');
    filters.forEach(filter => {
      filter = filter.split('=');
      let key = filter[0].split(':');
      let operator = key[1] || "=";
      let value = filter[1];

      if (operator == 'begins_with') {
        params.FilterExpression = operator + "(" + key[0] + ", :" + key[0] + ")";
      } else {
        params.FilterExpression = key[0] + " " + operator + " :" + key[0];
      }

      params.ExpressionAttributeValues[':' + key[0]] = value;
    });
    return params;
  }

};
