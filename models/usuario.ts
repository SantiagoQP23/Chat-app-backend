import { Schema, model, SchemaType } from 'mongoose';

export interface IUsuario {
  nombre: string;
  email: string;
  password: string;
  online: boolean;
  lastConnection: Date;
  avatar: string;
  newMessage: Schema.Types.ObjectId;

}

const usuarioSchema = new Schema<IUsuario>({
  nombre: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false
  },
  lastConnection: {
    type: Date,

  },
  avatar: {
    type: String,
    default: ''
  },
  newMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Mensaje'
  }
});



usuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;

  return object;
});

export default model<IUsuario>('Usuario', usuarioSchema);
