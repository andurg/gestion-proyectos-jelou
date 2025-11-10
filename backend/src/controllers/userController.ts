import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @desc    Obtiene perfil del usuario logueado
 * @route   GET /api/users/profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {    
    const user = await User.findById(req.user!.id).select('-passwordHash'); 

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'Usuario no valido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el server');
  }
};