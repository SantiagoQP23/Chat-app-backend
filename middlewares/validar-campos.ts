import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";


export const validarCampos = (req: Request, res: Response, next: NextFunction) => {
  console.log('validarCampos');

  const errors = validationResult(req);

  if( !errors.isEmpty()){
    return res.status(400).json(errors);
  }
  next();
}

