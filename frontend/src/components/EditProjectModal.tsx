import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { IProject } from '../context/ProjectContext';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject; 
}

const EditProjectModal = ({ isOpen, onClose, project }: IProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [error, setError] = useState<string | null>(null);
  
  const { updateProject, isLoading } = useProjects();

  useEffect(() => {
    setName(project.name);
    setDescription(project.description || '');
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateProject(project._id, { name, description });
      onClose(); // Cierra el modal si fue exitoso
    } catch (err: any) {
      setError(err.message || 'Error al actualizar proyecto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Editar Proyecto</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500 ...">{error}</p>}
          
          <div className="mb-4">
            <label className="block mb-2 text-gray-300" htmlFor="name">Nombre</label>
            <input
              type="text" id="name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white" required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300" htmlFor="description">Descripción</label>
            <textarea
              id="description" rows={4} value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="...">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="...">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;