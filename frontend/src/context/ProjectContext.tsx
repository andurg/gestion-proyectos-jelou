import React, { createContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; 

export interface IPopulatedUser {
  _id: string;
  name: string;
  email: string;
}
// Tipos de datos
export interface IProject {
  _id: string;
  name: string;
  description?: string;
  owner: string | IPopulatedUser;
  collaborators: (string | IPopulatedUser)[];
  tasks: string[];
  createdAt: string;
}

interface IProjectContext {
  projects: IProject[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<void>;  
  getProjectById: (id: string) => Promise<IProject | null>;
  addCollaborator: (projectId: string, email: string) => Promise<IPopulatedUser>;
  removeCollaborator: (projectId: string, userId: string) => Promise<string>; 
  updateProject: (projectId: string, data: { name: string, description?: string }) => Promise<IProject>;
  deleteProject: (projectId: string) => Promise<void>;
}

// Contexto
export const ProjectContext = createContext<IProjectContext | undefined>(undefined);

// Proveedor
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return; // No hace nada si no esta logueado
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al cargar proyectos');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); 

  const createProject = async (name: string, description?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/projects', { name, description });
      setProjects(prevProjects => [...prevProjects, res.data]);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al crear el proyecto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectById = useCallback(async (id: string) => {
    if (!isAuthenticated) return null;
    setIsLoading(true); 
    setError(null);
    try {
      const res = await axios.get(`/api/projects/${id}`);
      return res.data; // Devuelve el proyecto encontrado
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al cargar el proyecto');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addCollaborator = useCallback(async (projectId: string, email: string): Promise<IPopulatedUser> => {
    try {
      const res = await axios.post(`/api/projects/${projectId}/collaborators`, { email });
      return res.data.user;
    } catch (err: any) {
      console.error(err);      
      throw new Error(err.response?.data?.msg || 'Error al añadir colaborador');
    }
  }, []);

  const removeCollaborator = useCallback(async (projectId: string, userId: string): Promise<string> => {
    try {
      await axios.delete(`/api/projects/${projectId}/collaborators/${userId}`);
      return userId; 
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error al eliminar colaborador');
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, data: { name: string, description?: string }): Promise<IProject> => {
    try {
      const res = await axios.put(`/api/projects/${projectId}`, data);
      // Actualizar la lista local de proyectos
      setProjects(prev => prev.map(p => (p._id === projectId ? res.data : p)));
      return res.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error al actualizar el proyecto');
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      // Eliminar el proyecto de la lista local
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error al eliminar el proyecto');
    }
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      isLoading,
      error,
      fetchProjects,
      createProject,
      getProjectById,
      addCollaborator,
      removeCollaborator,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};