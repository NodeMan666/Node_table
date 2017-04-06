import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const EventActual = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'position',
  },
  actualStatus: Boolean,
  clockedIn: Number,
  clockedOut: Number,
  originalClockedIn: Number,
  originalClockedOut: Number,
  createdBy: String,
  updatedBy: String,
});


EventActual.plugin(timestamps);
EventActual.plugin(update, ['organization', 'event', 'user', 'position', 'actualStatus',
  'clockedIn', 'clockedOut', 'originalClockedIn', 'originalClockedOut', 'createdBy', 'updatedBy' ]);


export default mongoose.model('eventActual', EventActual);
