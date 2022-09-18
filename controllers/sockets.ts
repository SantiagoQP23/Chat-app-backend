import Mensaje from "../models/mensaje";
import Usuario from "../models/usuario";
import { IMensaje } from '../models/mensaje';
import { ObjectId } from "mongoose";



export const usuarioConectado = async (uid: string) => {

  const usuario = await Usuario.findById(uid);

  usuario!.online = true;

  await usuario?.save();


  // Marcar los mensajes que han enviado al usuario.

  console.log('marcando mensajes como entregados')
  const res = await Mensaje.updateMany({
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
  })

  console.log('Se actualizaron ', res.modifiedCount, 'mensajes');



  return usuario;
}

export const usuarioDesconectado = async (uid: string) => {

  const usuario = await Usuario.findById(uid);

  usuario!.online = false;
  usuario!.lastConnection = new Date();

  await usuario?.save();

  return usuario;

}

export const getUsuario = async (uid: string) => {

  const usuario = await Usuario.findById(uid);

  return usuario;
}

export const grabarMensaje = async (newMensaje: IMensaje) => {

  try {
    const mensaje = new Mensaje(newMensaje);
    await mensaje.save();
    return mensaje;


  } catch (error) {
    console.log(error);
    return null;
  }
}







export const getUsuarios = async (uid: string) => {
  const usuarios = await Usuario.find()
    .sort('-online');
  let usuariosM;

  await Promise.all(

    usuariosM = usuarios.map(async (user) => {

      if ((String(user._id) !== uid)) {

        const cantidad = await Mensaje.count({
          $and: [
            { status: 'entregado' },
            { de: user._id, para: uid },
          ]
        });
        const mensaje = await Mensaje.findOne({
          $and: [
            { status: 'entregado' },
            { de: user._id, para: uid },
          ]
        });

        return { ...user.toJSON(), ...mensaje!.toJSON(), cantidad }
      }
      return user

    })
  )

  console.log("Usuarios: ");
  console.log(usuariosM)



  return usuarios;
}


export const mensajeEntregado = async (idMensaje: string) => {
  const mensaje = await Mensaje.findById(idMensaje);

  mensaje!.status = 'entregado';

  await mensaje?.save();

  return mensaje;

}

export const mensajeLeido = async (idMensaje: string) => {
  const mensaje = await Mensaje.findById(idMensaje);

  mensaje!.status = 'leido';

  await mensaje?.save();

  return mensaje;

}


export const mensajesLeidos = async (uid: string, uidChat: string) => {
  const res = await Mensaje.updateMany({
    $and: [
      { status: 'entregado' },
      { de: uidChat, para: uid },
    ]
  }, {
    status: 'leido'
  })

  return res.modifiedCount;


}