import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User'; // modelo del usuario
import 'dotenv/config'; 

// Función que genera un JWT
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no definida.');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '5d', // token válido por 5 días
  });
};

/**
 * @desc    Registro de nuevo usuario validando datos del body con express-validator
 * @route   POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  //Verifica si usuario existe
  try {    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email ya existe' });
    }

    //Hash del pass
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      passwordHash,
    });

    // Guarda usuario en BD
    await user.save();

    //Genera token y se envía al cliente
    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el registro del usuario');
  }
};

/**
 * @desc    Login usuario
 * @route   POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  //Valida user registrado por email
  try {    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales no validas' });
    }

    //Valida el pass con el hash guardado
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales no validas' });
    }
    const token = generateToken(user.id);
    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servser durante login');
  }
};