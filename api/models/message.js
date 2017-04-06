import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Message = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
  },
  message: String,
});

Message.plugin(timestamps);
Message.plugin(update, ['message']);


export default mongoose.model('message', Message);
