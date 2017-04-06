import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const StaffAvailability= new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'staff',
    index: true,
  },
  mondayStart: Date,
  mondayEnd: Date,
  tuesdayStart: Date,
  tuesdayEnd: Date,
  wednesdayStart: Date,
  wednesdayEnd: Date,
  thursdayStart: Date,
  thursdayEnd: Date,
  fridayStart: Date,
  fridayEnd: Date,
  saturdayStart: Date,
  saturdayEnd: Date,
  sundayStart: Date,
  sundayEnd: Date,
  createdBy: String,
  updatedBy: String,
});

StaffAvailability.index({ user: 1, organization: 1}, { unique: true });

StaffAvailability.plugin(timestamps);
StaffAvailability.plugin(update, ['staff', 'mondayStart', 'mondayEnd', 'tuesdayStart', 'tuesdayEnd',
  'wednesdayStart', 'wednesdayEnd', 'thursdayStart', 'thursdayEnd', 'fridayStart', 'fridayEnd', 'saturdayStart', 'saturdayEnd',
  'sundayStart', 'sundayEnd', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('staffAvailability', StaffAvailability);
