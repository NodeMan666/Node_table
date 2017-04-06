/* do NOT change this to ES6 export or config wont work */

module.exports = {
  twilio: {
    TWILIO_PHONE_NUMBER: '+14243836835',
    TWILIO_ACCOUNT_SID: 'AC3adce47ba390351b51d1194f10672be8',
    TWILIO_AUTH_TOKEN: '4600992c360a5848d81b7962746c55a5'
  },
  stripe: {
    STRIPE_SECRET: 'sk_test_IzaeCeNIAijqruBm2UoRQ2gX',
    STRIPE_PUBLISHABLE: 'pk_test_kLq982KtwRPPd4rcn7nrmOb5'
  },
  redis: {
    REDIS_URL: 'redis://localhost:6379'
  },

  MANDRILL_API_KEY: 'd0kIZ7019O7IpWtU3LeiQw',
  MONGO_URI: 'mongodb://localhost/localtable-dev',
  LOCALTABLE_SECRET: 'localtable_secret',
  SITE_URL: 'http://localtable.co',
  NODE_ENV: 'development',
};
