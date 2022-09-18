
import express, { Application } from 'express';
import cors from "cors";
import { createServer, Server as ServerHttp } from "http";
import { Server as socketio } from 'socket.io';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';


import Sockets from './sockets';

import { dbConnection } from "../database/config";

// Routes

import authRoutes from '../routes/auth';
import mensajesRoutes from '../routes/mensajes';






class Server {

  private app: Application;
  private port: string;

  private paths = {

    auth: '/api/auth',
    mensajes: '/api/mensajes',
    pedidos: '/api/pedidos',
    
  }
  private server: ServerHttp;
  private io: socketio;

  constructor() {

    this.app = express();
    this.port = process.env.PORT || '5000';

    //Conectar a DB
    dbConnection();

    // Http server
    this.server = createServer(this.app);

    // Configuraciones de sockets
    this.io = new socketio(this.server, { /* configuraciones */ });
  }

  middlewares() {
    // Desplegar el directorio público
    this.app.use( express.static('public'));

    this.app.use(morgan('dev'));

    this.app.use(cors());

    this.app.use( express.json());

    this.app.use( fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }))



    this.routes();
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  routes(){
    this.app.use( this.paths.auth, authRoutes);
    this.app.use( this.paths.mensajes, mensajesRoutes);
  }

  execute() {

    this.middlewares();

    this.configurarSockets();

    this.server.listen(this.port, () => {
      console.log('Server corriendo en puerto:', this.port);
    });
  }

}

export default Server;