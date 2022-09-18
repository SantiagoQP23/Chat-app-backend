"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  path: ???
 */
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../helpers/db-validators");
const auth_2 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
], validar_campos_1.validarCampos, auth_1.login);
router.get('/renew', validar_jwt_1.validarJWT, auth_1.revalidarToken);
router.post('/signup', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmail),
    (0, express_validator_1.check)('nombre', 'El nombre de usuario es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
], validar_campos_1.validarCampos, auth_1.signup);
router.use(validar_jwt_1.validarJWT);
router.patch('/password', [
    (0, express_validator_1.check)('password', 'La constraseña actual es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('newPassword', 'La constraseña actual es obligatorio').not().isEmpty(),
], validar_campos_1.validarCampos, auth_1.changePassword);
router.patch('/username', [
    (0, express_validator_1.check)('nombre', 'No se envió el nombre').not().isEmpty(),
], validar_campos_1.validarCampos, auth_1.changeUsername);
router.patch('/avatar', auth_2.grabarAvatar);
exports.default = router;
//# sourceMappingURL=auth.js.map