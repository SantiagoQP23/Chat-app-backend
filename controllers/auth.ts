
import { Request, Response } from "express";
import Usuario from "../models/usuario";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt";
import { fileUpload } from "../helpers/fileUpload";




export const login = async (req: Request, res: Response) => {

  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });


    if (!usuario) {
      return res.status(400).json({
        msg: "No se encontro al usuario"
      })
    }

    // Verificar la constraseña 
    // Comparar con bcrypt

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta"
      })
    }

    // Generar el JWT

    const token = await generarJWT(`${usuario!.id}`);


    return res.status(200).json({
      ok: true,
      usuario,
      token
      // usuario: user, token 
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Hable con el administrador"
    })
  }
}

interface IRequest extends Request {
  uid?: string
}


export const revalidarToken = async (req: IRequest, res: Response) => {

  const { uid } = req;

  const usuario = await Usuario.findById(uid);

  const token = await generarJWT(uid)

  res.status(200).json({
    ok: true,
    usuario,
    token
  });
}



export const signup = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const usuario = new Usuario({
      nombre, email, password: hash
    });
    await usuario.save();

    const token = await generarJWT(`${usuario!.id}`);




    res.status(201).json({
      msg: 'El usuario se creo correctamente',
      usuario, token
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}


export const changePassword = async (req: IRequest, res: Response) => {

  const { uid } = req;

  const { password, newPassword } = req.body;

  const usuario = await Usuario.findById(uid);

  const validPassword = bcryptjs.compareSync(password, usuario!.password);

  if (!validPassword) {
    return res.status(400).json({
      msg: "La contraseña es incorrecta"
    })
  }

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(newPassword, salt);

  usuario!.password = hash;

  await usuario!.save();


  return res.status(201).json({
    msg: "La contraseña ha sido cambiada"
  })




}


export const changeUsername = async (req: IRequest, res: Response) => {

  const {uid} = req;

  const {nombre} = req.body;

  try {
    
    const usuario = await Usuario.findById(uid);

    usuario!.nombre = nombre;

    usuario!.save();

    res.status(201).json({
      msg: 'El nombre se cambió correctamente'
    })
  
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'No se pudo cambiar el nombre'
    })
    
  }

}

export const grabarAvatar = async (req: IRequest, res: Response) => {

  const { uid } = req;


  try {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
      res.status(400).json({
        msg: 'No se subieron archivos'
      })
    }

    try {
      const usuario = await Usuario.findById(uid);

      const imagen = req.files!.imagen as any;

      const img = imagen.tempFilePath;

      const nameImg = usuario!.email.split('@')[0];

      const url = await fileUpload(img, nameImg);

      usuario!.avatar = url!;

      await usuario!.save();

      

      res.status(201).json({
        msg: 'La imagen se subió correctamente',
        url,
      
      })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Error al subir la imagen'
      });
    }


  } catch (error) {
    console.log(error);
  }

}





