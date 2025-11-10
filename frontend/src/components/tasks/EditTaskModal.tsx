import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { ITask, TaskPriority, ITaskUpdateData } from '../../context/TaskContext';
import { IPopulatedUser } from '../../context/ProjectContext';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask; 
  members: IPopulatedUser[]; 
}

const EditTaskModal = ({ isOpen, onClose, task, members }: IProps) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || '');
  const [error, setError] = useState<string | null>(null);
  
  const { updateTask, isLoading } = useTasks();

  useEffect(() => {
    setName(task.name);
    setDescription(task.description || '');
    setPriority(task.priority);
    setAssignedTo(task.assignedTo?._id || '');
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const taskData: ITaskUpdateData = {
        name,
        description,
        priority,
        // Envia 'null' si está "Sin asignar", 'undefined' si no cambió
        assignedTo: assignedTo === '' ? null : assignedTo,
      };
      await updateTask(task._id, taskData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la tarea');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Editar Tarea</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}
          
          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="name">Nombre Tarea</label>
            <input
              type="text" id="name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="assignedTo">Asignar a</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
            >
              <option value="">(Sin asignar)</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="priority">Prioridad</label>
            <select
              id="priority" value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-gray-300" htmlFor="description">Descripción</label>
            <textarea
              id="description" rows={3} value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 px-4 rounded-lg transition duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold p-2 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;