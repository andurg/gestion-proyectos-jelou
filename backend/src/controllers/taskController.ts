import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project'; 
import Task from '../models/Task';

// Verifica si un usuario es miembro (owner o colaborador) de un proyecto
const checkProjectMembership = async (projectId: string, userId: string): Promise<boolean> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Proyecto no encontrado'); 
  }

  const isOwner = project.owner.toString() === userId;
  const isCollaborator = project.collaborators.some(
    c => c.toString() === userId
  );

  return isOwner || isCollaborator;
};


/**
 * @desc    Crea una nueva tarea
 * @route   POST /api/tasks
 */
export const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, projectId, assignedTo } = req.body;

  try {
    // Es miembro del proyecto? 
    const isMember = await checkProjectMembership(projectId, req.user!.id);
    if (!isMember) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }

     if (assignedTo) {
      const isAssigneeMember = await checkProjectMembership(projectId, assignedTo);
      if (!isAssigneeMember) {
        return res.status(400).json({ msg: 'El usuario no es miembro del proyecto' });
      }
    }

    const newTask = new Task({
      name,
      description,
      priority,
      project: projectId,
      assignedTo,
      createdBy: req.user!.id, 
    });

    const task = await newTask.save();

    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: task._id }
    });

    res.status(201).json(task);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Obtiene todas las tareas de un proyecto
 * @route   GET /api/tasks?project=:projectId
 */
export const getProjectTasks = async (req: Request, res: Response) => {
  const { project } = req.query; 

  if (!project) {
    return res.status(400).json({ msg: 'ID del proyecto es requerido' });
  }

  try {
    const isMember = await checkProjectMembership(project.toString(), req.user!.id);
    if (!isMember) {
      return res.status(403).json({ msg: 'Acceso no permitdo' });
    }

    const tasks = await Task.find({ project })
      .populate('assignedTo', 'name email') // Usuario asignado
      .populate('createdBy', 'name email'); // Usuario Owner

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Actualiza tarea
 * @route   PUT /api/tasks/:id
 */
export const updateTask = async (req: Request, res: Response) => {
  const { name, description, status, priority, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    const isMember = await checkProjectMembership(task.project.toString(), req.user!.id);
    if (!isMember) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }

    if (assignedTo) {
      const isAssigneeMember = await checkProjectMembership(task.project.toString(), assignedTo);
      if (!isAssigneeMember) {
        return res.status(400).json({ msg: 'El usuario asignado no es miembro del proyecto' });
      }
    }

    // Actualizar campos
    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Elimina tarea
 * @route   DELETE /api/tasks/:id
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    const isMember = await checkProjectMembership(task.project.toString(), req.user!.id);
    if (!isMember) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }
    
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id }
    });

    await task.deleteOne();

    res.json({ msg: 'Tarea eliminada' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};