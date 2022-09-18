import {Schema, model} from 'mongoose';

export interface IMensaje{
  de: Schema.Types.ObjectId;
  para: Schema.Types.ObjectId;
  mensaje: string;
  status: 'enviado' |'entregado' | 'leido';
}

const MensajeSchema = new Schema<IMensaje>({
  de: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
    
  },

  para : {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  mensaje: {
    type: String,
    required: true,

  },
  status: {
    type: String,
    default: 'enviado'

  }
  
}, {
  timestamps: true
});



MensajeSchema.method('toJSON', function(){
  const  {__v, ...object} = this.toObject();
  return object;
});

export default model<IMensaje>('Mensaje', MensajeSchema);
