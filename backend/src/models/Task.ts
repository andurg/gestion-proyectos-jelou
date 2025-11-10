import mongoose, { Schema, Document, Types } from 'mongoose';

// estados y prioridades
export type TaskStatus = "pendiente" | "en progreso" | "completada";
export type TaskPriority = "baja" | "media" | "alta";

export interface ITask extends Document {
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: Types.ObjectId; // Proyecto
  assignedTo?: Types.ObjectId; // Usuario asignado
  createdBy: Types.ObjectId; // Usuario cresador
}

const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pendiente", "en progreso", "completada"], // Valores permitidos
    default: "pendiente",
  },
  priority: {
    type: String,
    enum: ["baja", "media", "alta"], // Valores permitidos
    default: "media",
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: undefined,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model<ITask>('Task', TaskSchema);