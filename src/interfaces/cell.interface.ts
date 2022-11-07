import { Document } from "mongoose"
import { StockItem } from "./stock.interface"

export interface ICell extends Document {
    products: {
        product_id: StockItem['_id']
        quantity: number
        barcode: string
        article: string // merchants article
    }[]
    address: string
}