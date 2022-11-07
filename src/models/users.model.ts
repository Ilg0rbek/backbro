import {model, Schema, Document, } from 'mongoose';
import { IUser} from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    background: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean, 
    default: true
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  }
}, {
  timestamps: true
});

const userModel = model<IUser & Document>('User', userSchema);

export default userModel;
