import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  githubId: { type: String, default: null },
  userId : {type : String, required : true},
  username: String,
  email: String,
  avatarUrl: String,
  password : {type : String},
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default model('User', userSchema);
