import { Request, Response } from 'express';
import Project from '../models/Project';
import Task, { TaskStatus } from '../models/Task';

/**
 * @desc    Obtener estadísticas del dashboard del usuario
 * @route   GET /api/dashboard/stats
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  const userId = req.user!.id; // ID del usuario logueado

  try {
    // Carga todos los Proyectos del Usuario     
    const userProjects = await Project.find({
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    }).select('_id'); // Solo los IDs

    const projectIds = userProjects.map(project => project._id);

    // Calcula Estadísticas de Tareas 
    const [totalTasks, tasksByStatus] = await Promise.all([

      // Cuenta el total de tareas en esos proyectos
      Task.countDocuments({ project: { $in: projectIds } }),

      // Usa Aggregation para agrupar tareas por estado
      Task.aggregate([
        {
          // Filtrado de tareas de los proyectos del usuario
          $match: {
            project: { $in: projectIds }
          }
        },
        {
          $group: {
            _id: '$status', // Agrupar por estatus
            count: { $sum: 1 } 
          }
        }
      ])
    ]);

    // Total de Proyectos
    const totalProjects = userProjects.length;

    const formattedStatus: Record<TaskStatus, number> = {
      "pendiente": 0,
      "en progreso": 0,
      "completada": 0,
    };

    tasksByStatus.forEach((item: { _id: TaskStatus, count: number }) => {
      if (formattedStatus.hasOwnProperty(item._id)) {
        formattedStatus[item._id] = item.count;
      }
    });

    res.json({
      totalProjects,
      totalTasks,
      tasksByStatus: formattedStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server al calcular estadísticas');
  }
};