import express from 'express';
import { body } from 'express-validator'; // <-- ESTA LÍNEA ESTABA ROTA
import { protect } from '../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator
} from '../controllers/projectController';

const router = express.Router();

// --- Schemas de Proyecto ---
/**
 * @swagger
 * components:
 * schemas:
 * Project:
 * type: object
 * properties:
 * _id:
 * type: string
 * example: 60d0fe4f5311236168a109cb
 * name:
 * type: string
 * example: Nuevo Sitio Web
 * description:
 * type: string
 * example: Desarrollo del e-commerce
 * owner:
 * $ref: '#/components/schemas/User'
 * collaborators:
 * type: array
 * items:
 * $ref: '#/components/schemas/User'
 * tasks:
 * type: array
 * items:
 * type: string
 * createdAt:
 * type: string
 * format: date-time
 * ProjectInput:
 * type: object
 * required: [name]
 * properties:
 * name:
 * type: string
 * example: Nuevo Sitio Web
 * description:
 * type: string
 * example: Desarrollo del e-commerce
 * AddCollaboratorInput:
 * type: object
 * required: [email]
 * properties:
 * email:
 * type: string
 * format: email
 * example: colaborador@correo.com
 */

// Aplicar protección a todas las rutas
router.use(protect);

/**
 * @swagger
 * /api/projects:
 * get:
 * summary: Obtiene todos los proyectos del usuario
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Lista de proyectos
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Project'
 * '401':
 * description: No autorizado
 * post:
 * summary: Crea un nuevo proyecto
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProjectInput'
 * responses:
 * '201':
 * description: Proyecto creado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Project'
 * '400':
 * description: Error de validación
 * '401':
 * description: No autorizado
 */
router.route('/')
  .post(
    [ body('name', 'El nombre del proyecto es obligatorio').not().isEmpty() ], 
    createProject
  )
  .get(getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 * get:
 * summary: Obtiene un proyecto por ID
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID del proyecto
 * responses:
 * '200':
 * description: Detalles del proyecto
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Project'
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es miembro)
 * '404':
 * description: Proyecto no encontrado
 * put:
 * summary: Actualiza un proyecto (solo el dueño)
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProjectInput'
 * responses:
 * '200':
 * description: Proyecto actualizado
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es dueño)
 * '404':
 * description: Proyecto no encontrado
 * delete:
 * summary: Elimina un proyecto (solo el dueño)
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * '200':
 * description: Proyecto eliminado
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es dueño)
 * '404':
 * description: Proyecto no encontrado
 */
router.route('/:id')
  .get(getProjectById)
  .put(
    [ body('name', 'El nombre no puede estar vacío').optional().not().isEmpty() ],
    updateProject
  )
  .delete(deleteProject);

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 * post:
 * summary: Añade un colaborador a un proyecto (solo el dueño)
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AddCollaboratorInput'
 * responses:
 * '200':
 * description: Colaborador añadido
 * '400':
 * description: El usuario ya es colaborador
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es dueño)
 * '404':
 * description: Proyecto o usuario no encontrado
 */
router.post(
  '/:id/collaborators',
  [ body('email', 'El email del colaborador es obligatorio').isEmail() ],
  addCollaborator
);

/**
 * @swagger
 * /api/projects/{id}/collaborators/{userId}:
 * delete:
 * summary: Elimina un colaborador de un proyecto (solo el dueño)
 * tags: [Proyectos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID del Proyecto
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: string
 * description: ID del Colaborador
 * responses:
 * '200':
 * description: Colaborador eliminado
 * '401':
 * description: No autorizado
 * '403':
 * description: Acceso no autorizado (no es dueño)
 */
router.delete(
  '/:id/collaborators/:userId',
  removeCollaborator
);

export default router;