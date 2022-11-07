import { Document, Types } from "mongoose"
import { CategoryFilters } from "./filters.interface"
import { IOrg } from "./orgs.interface"
import { Product } from "./product.interface"

export interface StockItem extends Document {
    product_uz: string
    product_ru: string
    slug_ru: string
    slug_uz: string
    product_id: Product['_id']
    quantity: number
    price: number
    discount: number // this in percent 0-100
    merchant: IOrg['_id']
    filters: {
        filter__id: string,
        filter_value_id: string
    }[],
    categories: string[],
    article: string,
    code: string,
    code_ikpu: string,
    description_uz: string,
    description_ru: string,
    images: {
        name: string,
        url: string
    }[],
    brand: string,
    additional_description_uz: string
    additional_description_ru: string
}


export interface IOrderStockItem {
    product_uz: string 
    product_ru: string
    merchant: any
    price: number
}