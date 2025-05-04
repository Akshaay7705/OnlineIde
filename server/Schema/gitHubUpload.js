import { Schema, model } from 'mongoose';

const githubUploadSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  githubUrl: String,
  repoName: String,
  uploadType: { type: String, enum: ['gist', 'repo'] },
  success: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default model('GitHubUpload', githubUploadSchema);
