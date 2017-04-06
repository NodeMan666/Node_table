import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const ShiftRequest = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
  },
  shift: {
    type: Schema.Types.ObjectId,
    ref: 'shift',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  requestCode: String,
  responseCode: Boolean,
  comment: String,
  createdBy: String,
  updatedBy: String,
});


ShiftRequest.plugin(timestamps);
ShiftRequest.plugin(update, ['organization', 'shift', 'user', 'requestCode', 'responseCode', 'comment',
  'createdBy', 'updatedBy' ]);


export default mongoose.model('shiftRequest', ShiftRequest);
