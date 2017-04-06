import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Staff = new Schema({
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
  maxWorkHours: Number,
  externalId: String,
  createdBy: String,
  updatedBy: String,
});

Staff.index({ user: 1, organization: 1}, { unique: true });

Staff.plugin(timestamps);
Staff.plugin(update, ['user', 'organization', 'maxWorkHours', 'externalId', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('staff', Staff);
