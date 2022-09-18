"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grabarAvatar = exports.changeUsername = exports.changePassword = exports.signup = exports.revalidarToken = exports.login = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_jwt_1 = require("../helpers/generar-jwt");
const fileUpload_1 = require("../helpers/fileUpload");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const usuario = yield usuario_1.default.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: "No se encontro al usuario"
            });
        }
        // Verificar la constraseña 
        // Comparar con bcrypt
        const validPassword = bcryptjs_1.default.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            });
        }
        // Generar el JWT
        const token = yield (0, generar_jwt_1.generarJWT)(`${usuario.id}`);
        return res.status(200).json({
            ok: true,
            usuario,
            token
            // usuario: user, token 
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador"
        });
    }
});
exports.login = login;
const revalidarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req;
    const usuario = yield usuario_1.default.findById(uid);
    const token = yield (0, generar_jwt_1.generarJWT)(uid);
    res.status(200).json({
        ok: true,
        usuario,
        token
    });
});
exports.revalidarToken = revalidarToken;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email, password } = req.body;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        const usuario = new usuario_1.default({
            nombre, email, password: hash
        });
        yield usuario.save();
        const token = yield (0, generar_jwt_1.generarJWT)(`${usuario.id}`);
        res.status(201).json({
            msg: 'El usuario se creo correctamente',
            usuario, token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.signup = signup;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req;
    const { password, newPassword } = req.body;
    const usuario = yield usuario_1.default.findById(uid);
    const validPassword = bcryptjs_1.default.compareSync(password, usuario.password);
    if (!validPassword) {
        return res.status(400).json({
            msg: "La contraseña es incorrecta"
        });
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hash = yield bcryptjs_1.default.hash(newPassword, salt);
    usuario.password = hash;
    yield usuario.save();
    return res.status(201).json({
        msg: "La contraseña ha sido cambiada"
    });
});
exports.changePassword = changePassword;
const changeUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req;
    const { nombre } = req.body;
    try {
        const usuario = yield usuario_1.default.findById(uid);
        usuario.nombre = nombre;
        usuario.save();
        res.status(201).json({
            msg: 'El nombre se cambió correctamente'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'No se pudo cambiar el nombre'
        });
    }
});
exports.changeUsername = changeUsername;
const grabarAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req;
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
            res.status(400).json({
                msg: 'No se subieron archivos'
            });
        }
        try {
            const usuario = yield usuario_1.default.findById(uid);
            const imagen = req.files.imagen;
            const img = imagen.tempFilePath;
            const nameImg = usuario.email.split('@')[0];
            const url = yield (0, fileUpload_1.fileUpload)(img, nameImg);
            usuario.avatar = url;
            yield usuario.save();
            res.status(201).json({
                msg: 'La imagen se subió correctamente',
                url,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error al subir la imagen'
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.grabarAvatar = grabarAvatar;
//# sourceMappingURL=auth.js.map