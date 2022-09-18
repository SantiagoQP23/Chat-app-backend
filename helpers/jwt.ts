import jwt from 'jsonwebtoken';

interface UserPayload {
  uid: string
}

export const comprobarJWT = (token = '') => {

  try {
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY!) as UserPayload;

    return [true, uid];
  } catch (error) {
    
    return [false, null];
  }


}