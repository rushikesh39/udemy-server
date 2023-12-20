const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log('connection successfull');
  } catch (error) {
    console.log(
      `Failed to Establish Connection with MongoDB with Error: ${error}`,
    );
  }
};

connect();

module.exports = mongoose;
