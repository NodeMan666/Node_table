/* do NOT change this to ES6 or config wont work */
var env = process.env;

module.exports =  {
  twilio: {
    TWILIO_PHONE_NUMBER: env.TWILIO_PHONE_NUMBER,
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN:  env.TWILIO_AUTH_TOKEN
  },
  stripe: {
    STRIPE_SECRET: env.STRIPE_SECRET,
    STRIPE_PUBLISHABLE: env.STRIPE_PUBLISHABLE
  },
  redis: {
    REDIS_URL: env.HEROKU_REDIS_AMBER_URL || env.REDIS_URL
  },

  MANDRILL_API_KEY: env.MANDRILL_API_KEY,
  MONGO_URI: env.MONGODB_URI,
  LOCALTABLE_SECRET: env.LOCALTABLE_SECRET,
  SITE_URL: env.SITE_URL,
  NODE_ENV: env.NODE_ENV,
};
