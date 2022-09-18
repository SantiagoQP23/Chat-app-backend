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
exports.getUsuarios = exports.obtenerChat = void 0;
const mensaje_1 = __importDefault(require("../models/mensaje"));
const usuario_1 = __importDefault(require("../models/usuario"));
const obtenerChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const miId = req.uid;
    const mensajesDe = req.params.de;
    const cantMensajes = yield mensaje_1.default.count();
    const cant = cantMensajes > 30 ? cantMensajes - 30 : 0;
    const last30 = yield mensaje_1.default.find({
        $or: [
            { de: miId, para: mensajesDe },
            { de: mensajesDe, para: miId },
        ]
    })
        .skip(cant)
        .sort({ createdAt: 'asc' });
    res.status(200).json({
        msg: 'Mensajes del chat',
        mensajes: last30
    });
});
exports.obtenerChat = obtenerChat;
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req;
    try {
        const usuarios = yield usuario_1.default.find()
            .sort('-online');
        let usuariosM;
        usuariosM = yield Promise.all(usuarios.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            if ((String(user._id) !== uid)) {
                const cantidad = yield mensaje_1.default.count({
                    $and: [
                        { status: 'entregado' },
                        { de: user._id, para: uid },
                    ]
                });
                const mensaje = yield mensaje_1.default.findOne({
                    $or: [
                        { de: user._id, para: uid },
                        { de: uid, para: user._id },
                    ],
                }).sort({ createdAt: 'desc' });
                return Object.assign(Object.assign({}, user.toJSON()), { mensaje: Object.assign({}, mensaje === null || mensaje === void 0 ? void 0 : mensaje.toJSON()), cantidadMensajes: cantidad });
            }
            return user;
        })));
        res.status(200).json({
            msg: 'Se obtuvieron los usuarios',
            usuarios: usuariosM
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.getUsuarios = getUsuarios;
//# sourceMappingURL=mensajes.js.map