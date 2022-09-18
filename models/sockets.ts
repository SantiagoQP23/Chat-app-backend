
import { ObjectId } from 'mongoose';
import { Server as socketio } from 'socket.io';
import { getUsuarios, usuarioConectado, grabarMensaje, usuarioDesconectado, mensajeEntregado, mensajesLeidos, mensajeLeido } from '../controllers/sockets';
import { comprobarJWT } from '../helpers/jwt';
import { IMensaje } from './mensaje';


class Sockets {

  private io: socketio;

  constructor(io: socketio) {

    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on('connection', async (socket) => {


      const [valido, uid] = comprobarJWT(socket.handshake.query['x-token'] as string);

      if (!valido) {
        console.log('Socket no identificado');
        return socket.disconnect();
      }

      socket.join(uid! as string);


      // Marcar mensajes como entregados y poner el estado online al usuario
      // Marcar mensajes como entregados 
      const usuario = await usuarioConectado(uid as string);
      console.log('usuario', usuario!.nombre);


      //  Comunicar a todos los usuarios el nuevo usuario conectado
      this.io.emit('usuario-conectado', uid);

      // Se recibe el uid del usuario del chat abierto
      socket.on('mensajes-leidos', async (uidChat: string) => {
       
        const resp = await mensajesLeidos(uid as string, uidChat);


        this.io.to(uidChat).emit('mensajes-leidos', uid);

        
      });

     

      // Si el usuario está online se debe mostrar una notificación del nuevo mensaje



      socket.on('mensaje-personal', async (payload: IMensaje, callback) => {
        const mensaje = await grabarMensaje(payload);
        callback({newMensaje: mensaje});

        this.io.to(String(mensaje?.para)).emit('mensaje-personal', {mensaje});


      });


      //escuchar mensaje entregado
      socket.on('mensaje-entregado', async (payload:string, callback) => {

        
        const mensaje = await mensajeEntregado(payload);

        if(mensaje){
          this.io.to(String(mensaje?.de)).emit('mensaje-entregado', payload);
        }
        
      })

      socket.on('mensaje-leido', async (payload:string, callback) => {

        
        const mensaje = await mensajeLeido(payload);

        if(mensaje){
          this.io.to(String(mensaje?.de)).emit('mensaje-leido', payload);
        }
        
      })


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


      socket.on('disconnect', async () => {
        const usuario = await usuarioDesconectado(uid as string);

        console.log('usuario desconectado')

        this.io.emit('usuario-desconectado', {
          uid: usuario!.id, 
          lastConnection: usuario!.lastConnection
        });
        //this.io.emit('lista-usuarios', await getUsuarios());


      });


    });

  }
}


export default Sockets;