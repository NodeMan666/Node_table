import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Location = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
  },
  name: String,
  address: String,
  addressLocality: String,
  addressRegion: String,
  addressPostcode: String,
  addressCountry: String,
  contact: String,
  phone: String,
  email: String,
  notes: String,
  directions: String,
  createdBy: String,
  updatedBy: String,
});

Location.plugin(timestamps);
Location.plugin(update, ['organization', 'name', 'address', 'addressLocality', 'addressRegion', 'addressPostcode',
  'addressCountry', 'contact', 'phone', 'email', 'notes', 'directions', 'createdBy', 'updatedBy' ]);


export default mongoose.model('location', Location);
