import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Organization = new Schema({
  name: String,
  welcomeText: String,
  timezone: String,
  logo: String,
  isRosterPublic: Boolean,
  isPersonPublic: Boolean,
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'subscription',
    index: true,
  },
  createdBy: String,
  updatedBy: String,
});

Organization.plugin(timestamps);
Organization.plugin(update, ['name', 'welcomeText', 'timezone', 'logo', 'isRosterPublic', 'isPersonPublic',
  'createdBy', 'updatedBy' ]);


Organization.methods.createStripeCustomer = async function() {
  const user = this;
  if(user.subscription) {
    const subscription = new Susbcription({user: user._id});
    await subscription.save();
    await subscription.createStripeCustomer();
    user.subscription = subscription._id;
    await user.save();
  }
  else {
    const subscription = await Subscription.findById(user.subscription);
    await subscription.createStripeCustomer();
  }
}

Organization.methods.addCreditCard = async function(stripe_token) {
  const user = this;

  if(user.subscription) {
    const subscription = await Subscription.findById(user.subscription);
    await subscription.addCreditCard(stripe_token);
  }
  else {
    return new Error('No customer created for stripe');
  }
}

Organization.methods.subscribe = async function(planId) {
  const user = this;

  if(user.subscription) {
    const subscription = await Subscription.findById(user.subscription);
    await subscription.subscribe(planId);
  }
  else {
    return new Error('No customer created for stripe');
  }
}

export default mongoose.model('organization', Organization);
