import React from 'react';
import { ITask, TaskStatus } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

interface IProps {
  title: string;
  status: TaskStatus;
  tasks: ITask[];
  onEditClick: (task: ITask) => void;
  onDeleteClick: (task: ITask) => void;
}

const TaskColumn = ({ title, status, tasks, onEditClick, onDeleteClick }: IProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const tasksInColumn = tasks.filter(task => task.status === status);
  const taskIds = tasksInColumn.map(t => t._id);

  return (
    <SortableContext items={taskIds}>
      <div 
        ref={setNodeRef} 
        className="bg-gray-800 rounded-lg p-4 flex-1"
      >
        <h3 className="text-xl font-bold text-white mb-6 pl-1">
          {title} ({tasksInColumn.length})
        </h3>
        
        {/* Contenedor de tareas */}
        <div className="min-h-[200px]"> 
          {tasksInColumn.length > 0 ? (
            tasksInColumn.map(task => (
              // Pasamos los props a TaskCard
              <TaskCard 
                key={task._id} 
                task={task} 
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-8">No hay tareas aquí</p>
          )}
        </div>
      </div>
    </SortableContext>
  );
};

export default TaskColumn;