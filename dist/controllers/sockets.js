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
exports.mensajesLeidos = exports.mensajeLeido = exports.mensajeEntregado = exports.getUsuarios = exports.grabarMensaje = exports.getUsuario = exports.usuarioDesconectado = exports.usuarioConectado = void 0;
const mensaje_1 = __importDefault(require("../models/mensaje"));
const usuario_1 = __importDefault(require("../models/usuario"));
const usuarioConectado = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.default.findById(uid);
    usuario.online = true;
    yield (usuario === null || usuario === void 0 ? void 0 : usuario.save());
    // Marcar los mensajes que han enviado al usuario.
    console.log('marcando mensajes como entregados');
    const res = yield mensaje_1.default.updateMany({
        $and: [
            {
                para: uid
            },
            {
                status: 'enviado'
            }
        ]
    }, {
        status: 'entregado'
    });
    console.log('Se actualizaron ', res.modifiedCount, 'mensajes');
    return usuario;
});
exports.usuarioConectado = usuarioConectado;
const usuarioDesconectado = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.default.findById(uid);
    usuario.online = false;
    usuario.lastConnection = new Date();
    yield (usuario === null || usuario === void 0 ? void 0 : usuario.save());
    return usuario;
});
exports.usuarioDesconectado = usuarioDesconectado;
const getUsuario = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.default.findById(uid);
    return usuario;
});
exports.getUsuario = getUsuario;
const grabarMensaje = (newMensaje) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mensaje = new mensaje_1.default(newMensaje);
        yield mensaje.save();
        return mensaje;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.grabarMensaje = grabarMensaje;
const getUsuarios = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield usuario_1.default.find()
        .sort('-online');
    let usuariosM;
    yield Promise.all(usuariosM = usuarios.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        if ((String(user._id) !== uid)) {
            const cantidad = yield mensaje_1.default.count({
                $and: [
                    { status: 'entregado' },
                    { de: user._id, para: uid },
                ]
            });
            const mensaje = yield mensaje_1.default.findOne({
                $and: [
                    { status: 'entregado' },
                    { de: user._id, para: uid },
                ]
            });
            return Object.assign(Object.assign(Object.assign({}, user.toJSON()), mensaje.toJSON()), { cantidad });
        }
        return user;
    })));
    console.log("Usuarios: ");
    console.log(usuariosM);
    return usuarios;
});
exports.getUsuarios = getUsuarios;
const mensajeEntregado = (idMensaje) => __awaiter(void 0, void 0, void 0, function* () {
    const mensaje = yield mensaje_1.default.findById(idMensaje);
    mensaje.status = 'entregado';
    yield (mensaje === null || mensaje === void 0 ? void 0 : mensaje.save());
    return mensaje;
});
exports.mensajeEntregado = mensajeEntregado;
const mensajeLeido = (idMensaje) => __awaiter(void 0, void 0, void 0, function* () {
    const mensaje = yield mensaje_1.default.findById(idMensaje);
    mensaje.status = 'leido';
    yield (mensaje === null || mensaje === void 0 ? void 0 : mensaje.save());
    return mensaje;
});
exports.mensajeLeido = mensajeLeido;
const mensajesLeidos = (uid, uidChat) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield mensaje_1.default.updateMany({
        $and: [
            { status: 'entregado' },
            { de: uidChat, para: uid },
        ]
    }, {
        status: 'leido'
    });
    return res.modifiedCount;
});
exports.mensajesLeidos = mensajesLeidos;
//# sourceMappingURL=sockets.js.map