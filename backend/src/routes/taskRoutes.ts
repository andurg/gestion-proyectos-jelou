import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController';

const router = express.Router();

// --- Schemas de Tarea ---
/**
 * @swagger
 * components:
 * schemas:
 * Task:
 * type: object
 * properties:
 * _id:
 * type: string
 * example: 60d0fe4f5311236168a109cc
 * name:
 * type: string
 * example: Diseñar Landing Page
 * description:
 * type: string
 * example: Mockup en Figma
 * status:
 * type: string
 * enum: [pendiente, en progreso, completada]
 * example: pendiente
 * priority:
 * type: string
 * enum: [baja, media, alta]
 * example: media
 * project:
 * type: string
 * example: 60d0fe4f5311236168a109cb
 * assignedTo:
 * $ref: '#/components/schemas/User'
 * createdBy:
 * $ref: '#/components/schemas/User'
 * createdAt:
 * type: string
 * format: date-time
 * TaskInput:
 * type: object
 * required: [name, projectId]
 * properties:
 * name:
 * type: string
 * example: Diseñar Landing Page
 * projectId:
 * type: string
 * example: 60d0fe4f5311236168a109cb
 * description:
 * type: string
 * example: Mockup en Figma
 * priority:
 * type: string
 * enum: [baja, media, alta]
 * example: media
 * assignedTo:
 * type: string
 * example: 60d0fe4f5311236168a109ca
 * TaskUpdateInput:
 * type: object
 * properties:
 * name:
 * type: string
 * description:
 * type: string
 * status:
 * type: string
 * enum: [pendiente, en progreso, completada]
 * priority:
 * type: string
 * enum: [baja, media, alta]
 * assignedTo:
 * type: string
 */

// Todas las rutas de tareas están protegidas
router.use(protect);

/**
 * @swagger
 * /api/tasks:
 * post:
 * summary: Crea una nueva tarea
 * tags: [Tareas]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/TaskInput'
 * responses:
 * '201':
 * description: Tarea creada
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es miembro)
 * get:
 * summary: Obtiene todas las tareas de un proyecto
 * tags: [Tareas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: project
 * required: true
 * schema:
 * type: string
 * description: ID del proyecto
 * responses:
 * '200':
 * description: Lista de tareas
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es miembro)
 */
router.route('/')
  .post(
    [
      body('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
      body('projectId', 'El ID del proyecto es obligatorio').not().isEmpty(),
    ],
    createTask
  )
  .get(getProjectTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 * put:
 * summary: Actualiza una tarea
 * tags: [Tareas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de la tarea
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/TaskUpdateInput'
 * responses:
 * '200':
 * description: Tarea actualizada
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es miembro)
 * '404':
 * description: Tarea no encontrada
 * delete:
 * summary: Elimina una tarea
 * tags: [Tareas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de la tarea
 * responses:
 * '200':
 * description: Tarea eliminada
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es miembro)
 * '404':
 * description: Tarea no encontrada
 */
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;