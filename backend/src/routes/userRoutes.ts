import express from 'express';
import { getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 * get:
 * summary: Obtiene el perfil del usuario autenticado
 * tags: [Usuarios]
 * security:
 * - bearerAuth: [] # Indica que esta ruta requiere el token JWT
 * responses:
 * '200':
 * description: Perfil del usuario obtenido exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * '401':
 * description: No autorizado (token inválido o no provisto)
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * '404':
 * description: Usuario no encontrado
 * '500':
 * description: Error en el servidor
 */
router.get('/profile', protect, getUserProfile);

export default router;