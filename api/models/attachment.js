import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Attachment = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
    index: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    index: true,
  },
  url: String,
  permissions: String,
  createdBy: String,
  updatedBy: String,
});


Attachment.plugin(timestamps);
Attachment.plugin(update, ['event', 'organization', 'url', 'permissions', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('attachment', Attachment);
