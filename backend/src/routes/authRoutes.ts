import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Validaciones para el registro del usuairio
const registerValidation = [
  body('name', 'Nombre es obligatorio').not().isEmpty(),
  body('email', 'Email inválido').isEmail(),
  body('password', 'El pass debe tener al menos 6 caracteres').isLength({ min: 6 }),
];

// Validación en el login
const loginValidation = [
  body('email', 'Email inválido').isEmail(),
  body('password', 'El pass es obligatorio').exists(),
];

// Registro: POST /api/auth/register
router.post('/register', registerValidation, registerUser);

// Login: POST /api/auth/login
router.post('/login', loginValidation, loginUser);

export default router;