import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { TaskPriority } from '../../context/TaskContext';
import { IPopulatedUser } from '../../context/ProjectContext';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: IPopulatedUser[];
}

const CreateTaskModal = ({ isOpen, onClose, projectId }: IProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { createTask, isLoading } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const taskData = {
        name,
        description,
        priority,
        projectId,      
        assignedTo: assignedTo || undefined 
      };
      await createTask({ name, description, priority, projectId });
      setName('');
      setDescription('');
      setPriority('media');
      setAssignedTo('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la tarea');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Crear Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="name">Nombre Tarea</label>
            <input
              type="text" id="name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white" required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="assignedTo">Asignar a</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
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
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-300" htmlFor="description">Descripcion</label>
            <textarea
              id="description" rows={3} value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700 p-2 px-4 rounded-lg">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="bg-sky-500 hover:bg-sky-600 p-2 px-4 rounded-lg">
              {isLoading ? 'Creando espere...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;