import { Document } from "mongoose"
import { ICell } from "./cell.interface"
import { IOrder } from "./order.iterface"
import { StockItem } from "./stock.interface"

export interface IMerchDoc extends Document {
    accepted: boolean
    started: boolean
    expected_date: string
    merchant: IOrder['_id']
    finishedDate: string
    doc_num: string
    products: {
        product_id: StockItem['_id']
        quantity: number
        barcode: string
        article: string // merchants article
        addresses: ICell['_id'][]
        scanned: number
    }[]
    acceptedDate: string
    createdAt: string
    updatedAt: string 
}