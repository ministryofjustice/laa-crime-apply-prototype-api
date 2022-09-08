module.exports = {
  dynamoTable: process.env.TABLE || 'applications-for-criminal-legal-aid-dev',
  schemas: {
    strict: 'https://raw.githubusercontent.com/ministryofjustice/laa-schemas/main/prototyping/criminal-legal-aid/1.0.0/schemas/legal_aid_application.json',
    tolerant: 'https://raw.githubusercontent.com/ministryofjustice/laa-schemas/main/prototyping/criminal-legal-aid/1.0.0/schemas/tolerant/legal_aid_application.json'
  }
};
