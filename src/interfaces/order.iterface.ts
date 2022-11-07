import { Document } from "mongoose";
import { ICustomer } from "./customer.interface";
import { StockItem } from "./stock.interface";

export enum Statuses {
    new = 'new',
    confirmed = 'confirmed',
    packaging = 'packaging',
    rtd = 'ready_to_delivery',
    delivering = 'delivering',
    done = 'done',
    cancelled = 'cancelled'
}

/**
 * ONLINE_PAYMENT - оплатили на сайте картой
CASH_ON_DELIVERY - оплатили наличкой после получения товара
TERMINAL_PAYMENT - оплатили картой после получения товара
 */


export enum PaymentMethods {
    ONLINE_PAYMENT = 'online',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    TERMINAL_PAYMENT = 'terminal_payment'
}

export interface IOrder extends Document {
    order_number?: number
    order_title: string
    started_collecting: boolean
    customer: ICustomer['_id']
    stock_items: {
        item:  StockItem['_id']
        quantity: number
        scanned: number
    }[]
    delivery_date: string
    archived: boolean
    delivered_date: string
    cancelled_date: string
    payment_method: PaymentMethods
    paid_date: string
    is_paid: boolean
    createdAt: string
    updatedAt: string
    statuses: {
        value: Statuses
        comment: string
        changed_date: Date
    }[]
}