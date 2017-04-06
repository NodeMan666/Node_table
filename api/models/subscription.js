import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';
import {User} from './index';
import {stripe, stripePubKey, plans} from '../common/stripe';

/**
 * User Schema
 */

const Subscription = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    unique: true,
    index: true,
  },
  stripe: {
    subscriptionId: String,
    customerId: String,
  },
  createdBy: String,
  updatedBy: String,
});

Subscription.plugin(timestamps);
Subscription.plugin(update, ['organization', 'stripe.subscriptionId', 'stripe.customerId',
  'createdBy', 'updatedBy' ]);

Subscription.methods.createStripeCustomer = async function() {
  const subscription = this;
  const customerDetails = await stripe.customers.create({email: user.email});
  subscription.stripe.customerId = customerDetails.id;
  await subscription.save();
  return customerDetails;
}

Subscription.methods.addCreditCard = async function(stripe_token) {
  const subscription = this;
  await stripe.customers.createSource(subscription.stripe.customerId, {source: stripe_token});
  await subscription.save();
}

Subscription.methods.subscribe = async function(planId) {
  const subscription = this;
  const subscriptionDetails = await stripe.subscriptions.create({ customer: subscription.stripe.customerId, plan: planId });
  subscription.stripe.subscriptionId = subscriptionDetails.id;
  await subscription.save();
}

export default mongoose.model('subscription', Subscription);
