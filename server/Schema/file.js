// file.js
import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  name: String,
  path: String,
  content: String,
  isFolder: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('File', fileSchema);
