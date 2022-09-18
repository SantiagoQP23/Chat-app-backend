/* 
  path: ??? 
 */
import { Router } from "express";
import { check } from "express-validator";
import { changePassword,  changeUsername,  login, revalidarToken, signup } from "../controllers/auth";
import { validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from '../middlewares/validar-campos';
import { existeEmail } from "../helpers/db-validators";
import { grabarAvatar } from '../controllers/auth';


const router = Router();

router.post('/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
  ],
  validarCampos,
  login);

router.get('/renew',
  validarJWT,
  revalidarToken);


router.post('/signup',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('email').custom(existeEmail),
    check('nombre', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),

  ],
  validarCampos,

  signup);

router.use(validarJWT);

router.patch('/password',
[
  check('password', 'La constraseña actual es obligatorio').not().isEmpty(),
  check('newPassword', 'La constraseña actual es obligatorio').not().isEmpty(),
],
validarCampos,
changePassword  
)

router.patch('/username',
[
  check('nombre', 'No se envió el nombre').not().isEmpty(),
 
],
validarCampos,
changeUsername  
)

router.patch('/avatar',
grabarAvatar
)



export default router;
