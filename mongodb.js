const { MongoClient } = require('mongodb');
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'sandbox'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database!');
  }

  console.log(`Connected to "${databaseName}" correctly!`);

})
