import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhlfua7l7',
  api_key: '221129468146471',
  api_secret: 'Kh4v25G-hdl8OZ5RF0K5f_69QL4',
  secure: true
})



export const fileUpload = async (file: string, name: string) => {

 // cloudinary.uploader.upload(file);

try {
  const resp = await cloudinary.uploader.upload(file, {
   secure: true,
   public_id: name,
   folder: 'chat'
  })

  return resp.secure_url;

 
} catch (error) {
  console.log("error", error);
  throw new Error('Error al subir la imagen');
}
  

  


}