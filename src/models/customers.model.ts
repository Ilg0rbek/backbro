import { model, Schema, Document } from 'mongoose';
import { ICustomer } from '@/interfaces/customer.interface';

const customerSchema: Schema = new Schema({
    first_name: String,
    last_name: String,
    contacts: [String],
    customer_tags: [String],
    phone_nums: [String],
    address: String,
    location: {
        zoom: Number,
        coords: [Number]
    }
}, {
    timestamps: true
});

const customerModel = model<ICustomer & Document>('Customer', customerSchema);

export default customerModel;
