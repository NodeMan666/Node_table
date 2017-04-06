import mongoose from 'mongoose';
import config from 'config3';

if(config.NODE_ENV === 'test') {
  require('mockgoose')(mongoose).then(function() {
    console.log('USING MOCK DATABASE!');
    config.MONGO_URI = 'mongodb://localhost/localtable-test';
    mongoose.connect(config.MONGO_URI);
  });
}
else {
  mongoose.connect(config.MONGO_URI);
}


mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open on ${config.MONGO_URI}`);
});

mongoose.connection.on('error', err => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.error('Mongoose connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose.connection;
