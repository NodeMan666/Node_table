import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Position = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    index: true,
  },
  positionName: String,
  createdBy: String,
  updatedBy: String,
});


Position.plugin(timestamps);
Position.plugin(update, ['organization', 'positionName', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('position', Position);
