import { Document } from "mongoose"
import { IRole } from "./role.interface"
import { IStaff } from "./staff.interface"

export interface IUser extends Document {
    username: string
    password: string 
    is_active: boolean
    is_delete: boolean
    staff: IStaff['_id']
    role: IRole['_id']
}