import { Request, Response, NextFunction } from 'express';

import jwt from "jsonwebtoken";
import Usuario from '../models/usuario';


interface UserPayload {
  uid: string
}
interface IRequest extends Request {
  uid?: string
}

export const validarJWT = async (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion'
    })
  }


  try {

    const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY!) as UserPayload;

    const { uid } = payload;

    if (!uid) {
      return res.status(401).json({
        msg: 'Token no valido - NO se envio usuario en el token'
      })
    }

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no valido - el usuario no existe'
      })
    }


    req.uid = uid;

    next();

  } catch (error) {

    console.log(error);
    return res.status(401).json({
      msg: 'Token no válido'
    })
  }
}
