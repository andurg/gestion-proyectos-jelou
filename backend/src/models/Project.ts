import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId; // Owner
  collaborators: Types.ObjectId[]; // Colaboradores
  tasks: Types.ObjectId[]; // Tareas
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task', 
  }]
}, {
  timestamps: true 
});

export default mongoose.model<IProject>('Project', ProjectSchema);