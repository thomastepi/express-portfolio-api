const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB database connection established successfully');
});

connection.on('error', (err) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  process.exit();
});

module.exports = connection;

