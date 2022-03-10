// Require the mongose library
const mongoose = require('mongoose');

module.exports = {
  connect: (DB_HOST) => {
    mongoose.connect(DB_HOST);
    // Log an error if we fail to connect
    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },

  close: () => {
    mongoose.connection.close();
  },
};
