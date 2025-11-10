import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks se debe usar con TaskProvider');
  }
  return context;
};