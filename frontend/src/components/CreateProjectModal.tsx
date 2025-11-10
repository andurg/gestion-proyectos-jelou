import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: IProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { createProject, isLoading } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createProject(name, description);
      setName('');
      setDescription('');
      onClose(); // Cierra el modal si fue exitoso
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al crear proyecto');
    }
  };

  if (!isOpen) return null;

  return (
    // Fondo oscuro 
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center">
      {/* Contenedor del Modal */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>

          {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="name">Nombre del Proyecto</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300" htmlFor="description">Descripción (Opcional)</label>
            <textarea
              id="description"
              rows={4}
              value={description}
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
              {isLoading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;