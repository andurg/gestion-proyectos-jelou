import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string; // guardo el hash del pass
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // validar q mas de 1 usuario no tengan el mismo mail
  },
  passwordHash: {
    type: String,
    required: true,
  }
}, {
  timestamps: true                    
});

export default mongoose.model<IUser>('User', UserSchema);