module.exports = {
  dynamoTable: process.env.TABLE || 'applications-for-criminal-legal-aid-dev',
  dynamoSettings: process.env.AWS_SAM_LOCAL ? { endpoint: 'http://dynamodb:8000' } : {}
};
