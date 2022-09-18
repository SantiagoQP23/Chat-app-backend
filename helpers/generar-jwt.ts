import jwt from "jsonwebtoken";

export const generarJWT = ( uid = '') => {

  return new Promise ((resolve, reject) => {

    // Crea un objeto que tiene la propiedad uid
    const payload = {uid};

    jwt.sign( payload, process.env.SECRETORPRIVATEKEY!, {
      expiresIn: '7d'
    }, (err, token) => {
      if(err){
        console.log(err);
        reject( 'No se pudo generar el token');

      } else {
        resolve(token)
      }
    })

  })
}
