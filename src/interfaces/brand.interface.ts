import { Document } from "mongoose"

export interface IBrand extends Document {
    title: string
    logo: string
  }
