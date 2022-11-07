import { IBrand } from '@/interfaces/brand.interface';
import { model, Schema, Document } from 'mongoose';

const brandSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const brandModel = model<IBrand & Document>('Brand', brandSchema);
export default brandModel;
