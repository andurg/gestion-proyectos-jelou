import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { IProject, IPopulatedUser } from '../context/ProjectContext';
import { TaskProvider, TaskStatus, useTasks, ITask, TaskPriority } from '../context/TaskContext';
import TaskColumn from '../components/tasks/TaskColumn';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import CollaboratorManager from '../components/CollaboratorManager';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { FaFilter } from 'react-icons/fa';

const ProjectBoard = ({ projectId, members }: { projectId: string, members: IPopulatedUser[] }) => {
  const { tasks, isLoading: isLoadingTasks, error: tasksError, fetchTasks, updateTaskStatus, deleteTask } = useTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>(''); // "" = todas
  const [assignedFilter, setAssignedFilter] = useState(''); // "" = todos

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    let newStatus: TaskStatus;
    const overId = over.id as string;
    if (["pendiente", "en progreso", "completada"].includes(overId)) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find(t => t._id === overId);
      if (!overTask) return;
      newStatus = overTask.status;
    }
    if (task.status === newStatus) return;
    updateTaskStatus(taskId, newStatus);
  };
  
  const handleEditClick = (task: ITask) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (task: ITask) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(task._id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      if (taskSearch && !task.name.toLowerCase().includes(taskSearch.toLowerCase())) {
        return false;
      }
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }
      if (assignedFilter && task.assignedTo?._id !== assignedFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, taskSearch, priorityFilter, assignedFilter]);

  let tasksContent;
  if (isLoadingTasks) {
    tasksContent = <p className="text-gray-300 text-center">Cargando tareas...</p>;
  } else if (tasksError) {
    tasksContent = <p className="text-red-400 text-center">{tasksError}</p>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Tablero de Tareas</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          + Nueva Tarea
        </button>
      </div>

      {/* --- NUEVA SECCIÓN DE FILTROS --- */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg flex flex-col md:flex-row gap-4 items-center">
        <FaFilter className="text-sky-400 flex-shrink-0" />
        <span className="font-bold text-white mr-2 flex-shrink-0">Filtrar Tareas:</span>
        
        {/* Búsqueda */}
        <input 
          type="text"
          placeholder="Buscar por nombre..."
          value={taskSearch}
          onChange={(e) => setTaskSearch(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full md:w-auto flex-grow"
        />
        
        {/* Prioridad */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
          className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
        >
          <option value="">Toda Prioridad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        
        {/* Asignado */}
        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
        >
          <option value="">Todo Asignado</option>
          {members.map(member => (
            <option key={member._id} value={member._id}>{member.name}</option>
          ))}
        </select>
      </div>

      {tasksContent}

      {/* Columnas Kanban */}
      <div className="flex flex-col md:flex-row gap-6">
        <TaskColumn title="Pendiente" status="pendiente" tasks={filteredTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
        <TaskColumn title="En Progreso" status="en progreso" tasks={filteredTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
        <TaskColumn title="Completada" status="completada" tasks={filteredTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
      </div>

      {/* Modal de Crear Tarea */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        members={members} 
      />

      {/* Modal de Editar Tarea */}
      {taskToEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={taskToEdit}
          members={members}
        />
      )}
    </DndContext>
  );
};


const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, isLoading: isLoadingProject } = useProjects(); // Viene de ProjectContext
  const [project, setProject] = useState<IProject | null>(null);

  const [members, setMembers] = useState<IPopulatedUser[]>([]);

  useEffect(() => {
    if (id) {
      getProjectById(id).then(setProject);
    }
  }, [id, getProjectById]);

  useEffect(() => {
    if (project) {
      const owner = (project.owner as IPopulatedUser);
      const collaborators = project.collaborators.filter(
        (c): c is IPopulatedUser => typeof c === 'object' && c !== null && '_id' in c
      );
      setMembers([owner, ...collaborators]);
    }
  }, [project]);


  if (isLoadingProject && !project) {
    return <div className="bg-gray-900 min-h-screen text-white p-8 text-center">Cargando Proyecto...</div>;
  }

  if (!project) {
    return <div className="bg-gray-900 min-h-screen text-white p-8 text-center">Proyecto no encontrado.</div>;
  }

  return (
    <TaskProvider>
      <div className="bg-gray-900 min-h-screen text-white">
        
        {/* --- Encabezado del Proyecto --- */}
        <header className="bg-gray-800 shadow p-4">
          <div className="container mx-auto">
            <Link to="/" className="text-sky-400 hover:underline">&larr; Volver a Proyectos</Link>
            <h1 className="text-4xl font-bold text-white mt-2">{project.name}</h1>
            <p className="text-gray-400">{project.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Dueño: {(project.owner as IPopulatedUser).name}
            </p>
          </div>
        </header>

        {/* --- Contenido Principal --- */}
        <main className="container mx-auto p-8">
          
          <ProjectBoard 
            projectId={project._id} 
            members={members} 
          />

          {/* --- Sección de Gestión de Colaboradores --- */}
          <CollaboratorManager 
            project={project} 
            onUpdate={setProject}
          />
        </main>
      </div>
    </TaskProvider>
  );
};

export default ProjectDetailPage;