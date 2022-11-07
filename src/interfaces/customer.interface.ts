import { Document } from "mongoose";

export interface ICustomer extends Document {
    first_name: string
    last_name: string
    contacts: string[]
    customer_tags: string[]
    phone_nums: string[]
    address: string
    location: {
        zoom: number
        coords: number[]
    }
}