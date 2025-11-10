import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useProjects } from '../hooks/useProjects';
import { IProject } from '../context/ProjectContext';
import Header from '../components/Header';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import { FaEdit, FaTrash, FaFolder, FaTasks, FaClock, FaCheckCircle, FaSearch } from 'react-icons/fa'; 
import StatCard from '../components/StatCard';

interface IStats {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: {
    "pendiente": number;
    "en progreso": number;
    "completada": number;
  };
}

const DashboardPage = () => {
  const { projects, isLoading: isLoadingProjects, error: projectsError, fetchProjects, deleteProject } = useProjects();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<IProject | null>(null);
  
  const [stats, setStats] = useState<IStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [fetchProjects]);

  const handleOpenEditModal = (project: IProject) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProject(projectId);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredProjects = React.useMemo(() => {
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);


  let projectsContent;
  if (isLoadingProjects) {
    projectsContent = <p className="text-gray-300 text-center">Cargando proyectos...</p>;
  } else if (projectsError) {
    projectsContent = <p className="text-red-400 text-center">{projectsError}</p>;
  } else if (projects.length === 0) {
    projectsContent = <p className="text-gray-400 text-center">No tienes proyectos. ¡Crea el primero!</p>;
  } else if (filteredProjects.length === 0 && searchQuery) {
    projectsContent = <p className="text-gray-400 text-center">No se encontraron proyectos que coincidan con la búsqueda.</p>;
  } else {
    projectsContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => ( 
          <div 
            key={project._id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between"
          >
            <div>
              <Link to={`/projects/${project._id}`} className="hover:underline">
                <h3 className="text-2xl font-bold text-sky-400 mb-2">{project.name}</h3>
              </Link>
              <p className="text-gray-400 line-clamp-2">{project.description || 'Sin descripción'}</p>
            </div>
            {/* Botones de Acción */}
            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => handleOpenEditModal(project)}
                className="text-gray-400 hover:text-yellow-400"
                aria-label="Editar proyecto"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleDeleteProject(project._id)}
                className="text-gray-400 hover:text-red-500"
                aria-label="Eliminar proyecto"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />

      <main className="container mx-auto p-8">
        
        {/* Sección de Estadísticas (Sin cambios) */}
        <h2 className="text-3xl font-bold mb-6">Resumen General</h2>
        {isLoadingStats ? (
          <p className="text-gray-400">Cargando estadísticas...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Proyectos Totales" value={stats.totalProjects} color="text-sky-400" icon={<FaFolder />} />
            <StatCard title="Tareas Totales" value={stats.totalTasks} color="text-blue-400" icon={<FaTasks />} />
            <StatCard title="Tareas Pendientes" value={stats.tasksByStatus.pendiente} color="text-yellow-400" icon={<FaClock />} />
            <StatCard title="Tareas Completadas" value={stats.tasksByStatus.completada} color="text-green-400" icon={<FaCheckCircle />} />
          </div>
        ) : (
          <p className="text-red-500">No se pudieron cargar las estadísticas.</p>
        )}

        {/* Sección de Proyectos */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Mis Proyectos</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            + Nuevo Proyecto
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-sky-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {projectsContent}

      </main>
      
      {/* Modales */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {projectToEdit && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={projectToEdit}
        />
      )}
    </div>
  );
};

export default DashboardPage;