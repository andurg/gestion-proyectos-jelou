import React, { createContext, useState, ReactNode, useCallback } from 'react';

//test
import axios from 'axios';

export type TaskStatus = "pendiente" | "en progreso" | "completada";
export type TaskPriority = "baja" | "media" | "alta";

export interface ITask {
  _id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string; // ID del proyecto
  assignedTo?: { _id: string, name: string }; // Objeto de usuario
  createdBy: { _id: string, name: string };
  createdAt: string;
}

export interface ITaskUpdateData {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string | null;
}

interface ITaskContext {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (data: { 
    name: string, 
    description?: string, 
    priority: TaskPriority, 
    projectId: string,
    assignedTo?: string 
  }) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTask: (taskId: string, data: ITaskUpdateData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const TaskContext = createContext<ITaskContext | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/tasks?project=${projectId}`);
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al cargar tareas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = async (data: { 
    name: string, 
    description?: string, 
    priority: TaskPriority, 
    projectId: string,
    assignedTo?: string 
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/tasks', data); 
      setTasks(prevTasks => [...prevTasks, res.data]);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al crear la tarea');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status } : task
        )
      );

      await axios.put(`/api/tasks/${taskId}`, { status });

    } catch (err: any) {
      setError('Error al actualizar estado. Sincronizando...');

      const taskToRevert = tasks.find(t => t._id === taskId);
      if (taskToRevert) await fetchTasks(taskToRevert.project);
    }
  };

  const updateTask = async (taskId: string, data: ITaskUpdateData) => {
    try {
      // Llamada a la API
      const res = await axios.put(`/api/tasks/${taskId}`, data);
      // Actualizar la tarea en el estado local
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? res.data : task
        )
      );
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error al actualizar la tarea');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      // Eliminar la tarea del estado local
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.msg || 'Error al eliminar la tarea');
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      error,
      fetchTasks,
      createTask,
      updateTaskStatus,
      updateTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};