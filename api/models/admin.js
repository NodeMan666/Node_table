import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Admin = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    index: true,
  },
  superAdmin: Boolean,
  powerAdmin: Boolean,
  billingAdmin: Boolean,
  creatdBy: String,
  updatedBy: String,
});

Admin.plugin(timestamps);
Admin.plugin(update, ['user', 'organization', 'superAdmin', 'powerAdmin', 'billingAdmin', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('admin', Admin);
