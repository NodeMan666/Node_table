import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const StaffPosition = new Schema({
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
  position: {
    type: Schema.Types.ObjectId,
    ref: 'position',
    index: true,
  },
  hourlyPay: Number,
  rating: Number,
  createdBy: String,
  updatedBy: String,
});

StaffPosition.index({ user: 1, organization: 1, position: 1}, { unique: true });

StaffPosition.plugin(timestamps);
StaffPosition.plugin(update, ['user', 'organization', 'position', 'hourlyPay', 'rating', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('staffPosition', StaffPosition);
