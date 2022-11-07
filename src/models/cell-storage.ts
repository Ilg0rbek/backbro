import { model, Schema, Document, Types, } from 'mongoose';
import { ICell } from '@/interfaces/cell.interface';

const cellSchema: Schema = new Schema({
    products: {
        type: [{
            article: {
                type: String,
                required: true
            },
            barcode: {
                type: String,
                required: true
            },
            product_id: {
                type: Types.ObjectId,
                ref: 'StockItem'
            },
            quantity: {
                type: Number,
                required: true
            } 
        }],
        default: []
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

const cellModel = model<ICell & Document>('Cell', cellSchema);

export default cellModel;
