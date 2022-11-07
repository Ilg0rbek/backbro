import {model, Schema, Document, } from 'mongoose';
import { IStaff } from '@/interfaces/staff.interface';

const staffSchema: Schema = new Schema({
  first_name: String,
  last_name: String,
  contacts: {
    type: [String],
    default: []
  },
  is_delete: {
    type: Boolean,
    default: false
  },
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  }
}, {
  timestamps: true
});

const staffModel = model<IStaff & Document>('Staff', staffSchema);

export default staffModel;
