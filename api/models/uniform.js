import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';

/**
 * User Schema
 */

const Uniform = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    index: true,
  },
  uniformName: String,
  createdBy: String,
  updatedBy: String,
});


Uniform.plugin(timestamps);
Uniform.plugin(update, ['organization', 'uniformName', 'creatdBy', 'updatedBy' ]);


export default mongoose.model('uniform', Uniform);
