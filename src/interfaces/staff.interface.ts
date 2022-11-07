import { Document } from "mongoose"
import { IBranch } from "./orgs.interface"

export interface IStaff extends Document {
    first_name: string
    last_name: string 
    contacts: string[]
    is_deleted: boolean
    org: IBranch['_id']
}