import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

// --- Schemas de Dashboard ---
/**
 * @swagger
 * components:
 * schemas:
 * TasksByStatus:
 * type: object
 * properties:
 * pendiente:
 * type: integer
 * en progreso:
 * type: integer
 * completada:
 * type: integer
 * DashboardStats:
 * type: object
 * properties:
 * totalProjects:
 * type: integer
 * example: 5
 * totalTasks:
 * type: integer
 * example: 42
 * tasksByStatus:
 * $ref: '#/components/schemas/TasksByStatus'
 */

// Todas las rutas aquí están protegidas
router.use(protect);

/**
 * @swagger
 * /api/dashboard/stats:
 * get:
 * summary: Obtiene las estadísticas del dashboard del usuario
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Estadísticas obtenidas
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/DashboardStats'
 * '401':
 * description: No autorizado
 * '500':
 * description: Error en el servidor
 */
router.get('/stats', getDashboardStats);

export default router;