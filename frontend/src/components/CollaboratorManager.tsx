import React, { useState } from 'react';
import { IProject, IPopulatedUser } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { FaTrash } from 'react-icons/fa';

interface IProps {
  project: IProject;
  onUpdate: (updatedProject: IProject) => void;
}

const CollaboratorManager = ({ project, onUpdate }: IProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user: authUser } = useAuth(); // El usuario autenticado
  const { addCollaborator, removeCollaborator } = useProjects();

  const isOwner = (project.owner as IPopulatedUser)?._id === authUser?.id;

  const collaborators = project.collaborators.filter(
    (c): c is IPopulatedUser => typeof c === 'object' && c !== null && '_id' in c
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    setIsLoading(true);
    setError(null);
    try {
      const newUser = await addCollaborator(project._id, email);
      onUpdate({
        ...project,
        collaborators: [...project.collaborators, newUser]
      });
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!isOwner || !window.confirm('¿Seguro que deseas eliminar a este colaborador?')) return;

    try {
      await removeCollaborator(project._id, userId);
      onUpdate({
        ...project,
        collaborators: project.collaborators.filter(
          c => (c as IPopulatedUser)._id !== userId
        )
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-10">
      <h3 className="text-2xl font-bold text-white mb-4">Colaboradores</h3>
      {isOwner && (
        <form onSubmit={handleAddSubmit} className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email del usuario a añadir"
            className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold p-2 px-4 rounded-lg"
          >
            {isLoading ? '...' : 'Añadir'}
          </button>
        </form>
      )}
      {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}

      <ul className="space-y-3">
        <li className="flex justify-between items-center bg-gray-700 p-3 rounded">
          <div>
            <span className="font-semibold text-white">{(project.owner as IPopulatedUser).name}</span>
            <span className="text-gray-400 ml-3">{(project.owner as IPopulatedUser).email}</span>
          </div>
          <span className="text-sky-400 font-bold text-sm">Dueño</span>
        </li>

        {collaborators.map(collab => (
          <li key={collab._id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
            <div>
              <span className="font-semibold text-white">{collab.name}</span>
              <span className="text-gray-400 ml-3">{collab.email}</span>
            </div>
            {isOwner && (
              <button onClick={() => handleRemove(collab._id)} className="text-red-400 hover:text-red-500">
                <FaTrash />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorManager;