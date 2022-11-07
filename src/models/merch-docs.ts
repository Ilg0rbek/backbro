import { model, Schema, Document, Types, } from 'mongoose';
import { IMerchDoc } from '@/interfaces/merch-doc.interface';

const merchDocsSchema: Schema = new Schema({
    accepted: {
        type: Boolean,
        default: false
    },
    started: {
        type: Boolean,
        default: false
    },
    expected_date: {
        type: Date,
        required: true
    },
    merchant: {
        type: Types.ObjectId,
        ref: 'Org',
        required: true
    },
    finishedDate: {
        type: Date,
        default: Date.now,
    },
    doc_num: {
        type: String,
    },
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
                ref: 'StockItem',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            scanned: {
               type: Number,
               default: 0 
            },  
            addresses: {
                type: [{
                    type: Types.ObjectId,
                    red: "Cell"
                }],
                default: []
            }
        }],
        default: []
    },
    accpetedDate: Date
}, {
    timestamps: true
});

const docsModel = model<IMerchDoc & Document>('Merchdoc', merchDocsSchema);

export default docsModel;
