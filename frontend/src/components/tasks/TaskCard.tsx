import React from 'react';
import { ITask, TaskPriority } from '../../context/TaskContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface IProps {
  task: ITask;
  onEditClick: (task: ITask) => void;
  onDeleteClick: (task: ITask) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'alta': return 'border-l-red-500';
    case 'media': return 'border-l-yellow-500';
    case 'baja': return 'border-l-green-500';
    default: return 'border-l-gray-500';
  }
};

const TaskCard = ({ task, onEditClick, onDeleteClick }: IProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Se ve semitransparente al arrastrar
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-gray-800 p-4 rounded-lg shadow-md mb-4 border-l-4 ${getPriorityColor(task.priority)}`}
    >
      <div className="flex justify-between items-start">
        <h4 
          {...listeners} 
          className="text-lg font-semibold text-white mb-1 cursor-grab"
        >
          {task.name}
        </h4>
        
        {/* Botones de Acción */}
        <div className="flex gap-3 flex-shrink-0 ml-2">
          <button 
            onClick={() => onEditClick(task)}
            className="text-gray-400 hover:text-yellow-400"
            aria-label="Editar tarea"
          >
            <FaEdit size={14} />
          </button>
          <button 
            onClick={() => onDeleteClick(task)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Eliminar tarea"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {task.description || 'Sin descripción'}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Asignada a: {task.assignedTo?.name || 'Nadie'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;