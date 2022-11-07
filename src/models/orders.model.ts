import { model, Schema, Document, Types } from 'mongoose';
import { IOrder, PaymentMethods, Statuses } from '@/interfaces/order.iterface';

const orderSchema: Schema = new Schema({
    order_number: {
        required: true,
        type: Number
    },
    started_collecting: {
        type: Boolean, 
        default: false
    },
    order_title: {
        required: true,
        type: String
    },
    stock_items: [{
        item: {
            required: true,
            ref: 'StockItem',
            type: Types.ObjectId
        },
        quantity: Number,
        scanned: {
            type: Number,
            default: 0
        }
    }],
    customer: {
        required: true,
        ref: 'Customer',
        type: Types.ObjectId
    },
    // quantity: Number,
    delivery_date: Date,
    delivered_date: Date,
    payment_method: {
        type: String,
        enum: PaymentMethods,
        required: true
    },
    paid_date: Date,
    archive: {
        type: Boolean,
        default: false
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    statuses: {
        type: [{
            value: {
                type: String,
                enum: Statuses,
                default: Statuses.new
            },
            comment: String,
            changed_date: {
                type: Date,
                default: new Date()
            }
        }]
    }
}, {
    timestamps: true
});

const orderModel = model<IOrder & Document>('Order', orderSchema);

export default orderModel;
