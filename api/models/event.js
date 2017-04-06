import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Event = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'organization',
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customer',
  },
  eventNumber: Number,
  eventName: String,
  startUnix: Date,
  endUnix: Date,
  description: String,
  adminNotes: String,
  budget: Number,
  allDay: Boolean,
  timezone: String,
  isRosterPublic: Boolean,
  createdBy: String,
  updatedBy: String,
});

Event.plugin(timestamps);
Event.plugin(update, ['organization', 'customer', 'eventNumber', 'eventName', 'startUnix', 'endUnix',
  'description', 'adminNotes', 'budget', 'allDay', 'timezone', 'isRosterPublic', 'createdBy', 'updatedBy' ]);


export default mongoose.model('event', Event);
