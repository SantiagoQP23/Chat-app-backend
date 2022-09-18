
import { Router } from "express";
import { check } from "express-validator";


import { validarJWT } from '../middlewares/validar-jwt';
import { validarCampos } from '../middlewares/validar-campos';
import { existeEmail } from "../helpers/db-validators";
import { getUsuarios, obtenerChat } from '../controllers/mensajes';


const router = Router();


router.get('/usuarios', validarJWT, getUsuarios);
router.get('/:de', validarJWT, obtenerChat);

export default router;