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
Object.defineProperty(exports, "__esModule", { value: true });
const sockets_1 = require("../controllers/sockets");
const jwt_1 = require("../helpers/jwt");
class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }
    socketEvents() {
        // On connection
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            const [valido, uid] = (0, jwt_1.comprobarJWT)(socket.handshake.query['x-token']);
            if (!valido) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }
            socket.join(uid);
            // Marcar mensajes como entregados y poner el estado online al usuario
            // Marcar mensajes como entregados 
            const usuario = yield (0, sockets_1.usuarioConectado)(uid);
            console.log('usuario', usuario.nombre);
            //  Comunicar a todos los usuarios el nuevo usuario conectado
            this.io.emit('usuario-conectado', uid);
            // Se recibe el uid del usuario del chat abierto
            socket.on('mensajes-leidos', (uidChat) => __awaiter(this, void 0, void 0, function* () {
                const resp = yield (0, sockets_1.mensajesLeidos)(uid, uidChat);
                this.io.to(uidChat).emit('mensajes-leidos', uid);
            }));
            // Si el usuario está online se debe mostrar una notificación del nuevo mensaje
            socket.on('mensaje-personal', (payload, callback) => __awaiter(this, void 0, void 0, function* () {
                const mensaje = yield (0, sockets_1.grabarMensaje)(payload);
                callback({ newMensaje: mensaje });
                this.io.to(String(mensaje === null || mensaje === void 0 ? void 0 : mensaje.para)).emit('mensaje-personal', { mensaje });
            }));
            //escuchar mensaje entregado
            socket.on('mensaje-entregado', (payload, callback) => __awaiter(this, void 0, void 0, function* () {
                const mensaje = yield (0, sockets_1.mensajeEntregado)(payload);
                if (mensaje) {
                    this.io.to(String(mensaje === null || mensaje === void 0 ? void 0 : mensaje.de)).emit('mensaje-entregado', payload);
                }
            }));
            socket.on('mensaje-leido', (payload, callback) => __awaiter(this, void 0, void 0, function* () {
                const mensaje = yield (0, sockets_1.mensajeLeido)(payload);
                if (mensaje) {
                    this.io.to(String(mensaje === null || mensaje === void 0 ? void 0 : mensaje.de)).emit('mensaje-leido', payload);
                }
            }));
            /*
             socket.on('nuevoDetalle', async (data: {detalle: INuevoDetallePedido, ok?: boolean}, callback) => {
              const {detalle} = data;
      
              const nuevoDetalle = await crearDetallePedido(detalle);
              
              callback({nuevoDetalle, ok: true});
      
              // Enviar a la pantalla de pedidos pendientes
              this.io.emit('nuevoDetalle', {nuevoDetalle: nuevoDetalle});
      
            });
             */
            // Unir al usuario a una sala de socket.io
            // TODO: Socket join
            // TODO: Escuchar cuando un cliente envia un mensaje
            // Mensaje personal
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                const usuario = yield (0, sockets_1.usuarioDesconectado)(uid);
                console.log('usuario desconectado');
                this.io.emit('usuario-desconectado', {
                    uid: usuario.id,
                    lastConnection: usuario.lastConnection
                });
                //this.io.emit('lista-usuarios', await getUsuarios());
            }));
        }));
    }
}
exports.default = Sockets;
//# sourceMappingURL=sockets.js.map