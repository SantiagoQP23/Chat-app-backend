import { Request, Response } from "express";
import Mensaje from "../models/mensaje";
import usuario from "../models/usuario";

interface IRequest extends Request {
  uid?: string
}

export const obtenerChat = async (req: IRequest, res: Response) => {

  const miId = req.uid;

  const mensajesDe = req.params.de;

  const cantMensajes = await Mensaje.count(); 
  const cant  = cantMensajes > 30 ? cantMensajes - 30 : 0;

  const last30 = await Mensaje.find({
    $or: [
      {de: miId, para: mensajesDe},
      {de: mensajesDe, para: miId},

    ]
  })
  .skip(cant)
  .sort({createdAt: 'asc'});

  res.status(200).json({
    msg: 'Mensajes del chat',
    mensajes: last30
  })


}



export const getUsuarios = async(req: IRequest, res: Response) => {

  const {uid} = req;
  

  try {
    
    const usuarios = await usuario.find()
      .sort('-online');
    let usuariosM;
  
    usuariosM = await Promise.all(
  
        usuarios.map(async (user) => {
    
        if ((String(user._id) !== uid)) {
    
          const cantidad = await Mensaje.count({
            $and: [
              { status: 'entregado' },
              { de: user._id, para: uid },
            ]
          });

          const mensaje = await Mensaje.findOne({
            $or: [
              {de: user._id, para: uid},
              {de: uid, para: user._id},
        
            ],
           
           
          }).sort({createdAt: 'desc'});
          
          return {...user.toJSON(), mensaje: {...mensaje?.toJSON()}, cantidadMensajes: cantidad}
        }
        return user
    
      })
    )
    
    res.status(200).json({
      msg: 'Se obtuvieron los usuarios',
      usuarios: usuariosM
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    }
    )
  }

  


  
} 
