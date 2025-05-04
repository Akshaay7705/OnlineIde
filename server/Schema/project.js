// project.js
import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Project', projectSchema);
