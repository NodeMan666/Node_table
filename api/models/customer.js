import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * Customer Schema
 */

const Customer = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    index: true,
  },
  name: String,
  phone: String,
  altPhone: String,
  contact: String,
  email: String,
  division: String,
  paymentType: String,
  notes: String,
  address: String,
  address2: String,
  addressLocality: String,
  addressRegion: String,
  addressPostcode: String,
  addressCountry: String,
  createdBy: String,
  updatedBy: String,
});

Customer.plugin(timestamps);
Customer.plugin(update, ['organization', 'name', 'phone', 'altPhone', 'contact',
  'email', 'division', 'paymentType', 'notes', 'address', 'address2',
  'addressLocality', 'addressRegion', 'addressPostcode', 'addressCountry', 'createdBy', 'updatedBy']);


export default mongoose.model('customer', Customer);
