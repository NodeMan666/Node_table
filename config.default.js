/* do NOT change this to ES6 export or config wont work */

module.exports = {
  twilio: {
    TWILIO_PHONE_NUMBER: '',
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: ''
  },
  stripe: {
    STRIPE_SECRET: '',
    STRIPE_PUBLISHABLE: ''
  },
  redis: {
    REDIS_URL: 'redis://localhost:6379'
  },

  MANDRILL_API_KEY: '',
  MONGO_URI: '',
  LOCALTABLE_SECRET: '',
  SITE_URL: '',
  NODE_ENV: 'development',
};
