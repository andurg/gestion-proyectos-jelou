import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project';
import User from '../models/User';

/**
 * @desc    Crear un nuevo proyecto
 * @route   POST /api/projects
 */
export const createProject = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      owner: req.user!.id, // Owner logueado
    });

    const project = await newProject.save();
    res.status(201).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

/**
 * @desc    Todos los proyectos del usuario
 * @route   GET /api/projects
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user!.id },
        { collaborators: req.user!.id }
      ]
    }).populate('owner', 'name email');

    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Obtiene proyecto por ID
 * @route   GET /api/projects/:id
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');
      // .populate('tasks'); 

    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // --- Verificación de Seguridad --- Owner o Colaborador
    const isOwner = project.owner._id.toString() === req.user!.id;
    const isCollaborator = project.collaborators.some(
      c => c._id.toString() === req.user!.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }

    res.json(project);

  } catch (error) {
    console.error(error);
     if (error instanceof Error && error.name === 'CastError') {
       return res.status(404).json({ msg: 'Proyecto no encontrado por ID no valido' });
    }
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Actualizar proyecto
 * @route   PUT /api/projects/:id
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // --- Verificación de Seguridad: Solo para el owner pueda actualizar ---
    if (project.owner.toString() !== req.user!.id) {
      return res.status(403).json({ msg: 'Acceso no permitido (solo el owner permitido)' });
    }

    const { name, description } = req.body;
    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();
    res.json(project);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Eliminar proyecto
 * @route   DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // --- Verificación de Seguridad: Solo para el owner pueda eliminar ---
    if (project.owner.toString() !== req.user!.id) {
      return res.status(403).json({ msg: 'Acceso no permitido (solo el owner puede eliminar)' });
    }

    await project.deleteOne();

    // Aquí también deberíamos eliminar todas las TAREAS asociadas (lo haremos en la Fase 7)

    res.json({ msg: 'Proyecto eliminado exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

// --- Colaboradores ---

/**
 * @desc    Añadir colaborador
 * @route   POST /api/projects/:id/collaborators
 */
export const addCollaborator = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Solo el owner puede agregar
    if (project.owner.toString() !== req.user!.id) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }

    // Buscar al usuario por email
    const userToAdd = await User.findOne({ email }).select('-passwordHash');
    if (!userToAdd) {
      return res.status(404).json({ msg: 'Usuario no encontrado con ese email' });
    }

    // Owner no puede ser colaborador de su mismo proyecto
    if (project.owner.toString() === userToAdd.id) {
      return res.status(400).json({ msg: 'El owner del proyecto no puede ser agregado como colaborador' });
    }

    // Verifica que no esté ya agrewgado
    if (project.collaborators.includes(userToAdd.id)) {
       return res.status(400).json({ msg: 'El usuario ya es colaborador' });
    }

    // 5. Añadir y guardar
    project.collaborators.push(userToAdd.id);
    await project.save();

    res.status(200).json({ msg: 'Colaborador agregado', user: userToAdd });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};

/**
 * @desc    Eliminar colaborador
 * @route   DELETE /api/projects/:id/collaborators/:userId
 */
export const removeCollaborator = async (req: Request, res: Response) => {
  const { id, userId } = req.params;

   try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Solo el owner puede eliminar
    if (project.owner.toString() !== req.user!.id) {
      return res.status(403).json({ msg: 'Acceso no permitido' });
    }

    project.collaborators = project.collaborators.filter(
        c => c.toString() !== userId
    );

    await project.save();
    res.status(200).json({ msg: 'Colaborador eliminado' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};