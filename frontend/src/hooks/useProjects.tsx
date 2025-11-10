import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects se debe usar con ProjectProvider');
  }
  return context;
};