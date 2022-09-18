import Usuario from "../models/usuario"

export const existeEmail = async (email: string) => {

  const existeEmail = await Usuario.findOne({email});

  if(existeEmail){
    throw new Error(`El email ${email} ya está registrado`)
  }


}