const fs = require('fs');
const path = require('path');
const db = require('./db');
const mapApplication = require('./mapApplication');
const config = require('./config');
const testDataDir = './test/data/';
const getTestJson = (filename) => require(testDataDir + filename);

module.exports = async () => {
  if (process.env.STAGE == 'production') {
    // todo; throw as 405
    return 'Operation not allowed';
  }

  let files = await fs.promises.readdir( path.join(__dirname, testDataDir) );
  for( const file of files ) {
    console.log('Seeding', file);
    let data = getTestJson(file);
    let params = {
      requestId: Math.floor(Math.random() * 1000000).toString(),
      path: Math.random() < 0.75 ? 'submit' : ''
    };
    let item = mapApplication(data, params);
    await db.create(item);
  }

  return 'Seeding complete';
};
