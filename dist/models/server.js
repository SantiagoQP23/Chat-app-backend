"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const morgan_1 = __importDefault(require("morgan"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const sockets_1 = __importDefault(require("./sockets"));
const config_1 = require("../database/config");
// Routes
const auth_1 = __importDefault(require("../routes/auth"));
const mensajes_1 = __importDefault(require("../routes/mensajes"));
class Server {
    constructor() {
        this.paths = {
            auth: '/api/auth',
            mensajes: '/api/mensajes',
            pedidos: '/api/pedidos',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '5000';
        //Conectar a DB
        (0, config_1.dbConnection)();
        // Http server
        this.server = (0, http_1.createServer)(this.app);
        // Configuraciones de sockets
        this.io = new socket_io_1.Server(this.server, { /* configuraciones */});
    }
    middlewares() {
        // Desplegar el directorio público
        this.app.use(express_1.default.static('public'));
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));
        this.routes();
    }
    configurarSockets() {
        new sockets_1.default(this.io);
    }
    routes() {
        this.app.use(this.paths.auth, auth_1.default);
        this.app.use(this.paths.mensajes, mensajes_1.default);
    }
    execute() {
        this.middlewares();
        this.configurarSockets();
        this.server.listen(this.port, () => {
            console.log('Server corriendo en puerto:', this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map