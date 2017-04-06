import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Shift = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'position',
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'location',
  },
  uniform: {
    type: Schema.Types.ObjectId,
    ref: 'uniform',
  },
  shiftFilledCount: Number,
  shiftRequiredCount: Number,
  startUnix: Date,
  endUnix: Date,
  createdBy: String,
  updatedBy: String,
});

Shift.index({ organization: 1, event:1, position: 1}, { unique: true });

Shift.plugin(timestamps);
Shift.plugin(update, ['organization', 'position', 'event', 'location', 'startUnix', 'endUnix',
  'uniform', 'shiftFilledCount', 'shiftRequiredCount', 'createdBy', 'updatedBy' ]);


export default mongoose.model('shift', Shift);
