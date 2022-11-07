import { Document } from "mongoose"

export interface IBranch extends Document {
    name: string
    is_new?: boolean
    is_for_delete?: boolean,
    is_main: boolean
    location: {
      zoom: number
      coords: number[]
    }
    contacts: string[]
  }
  
  export interface IOrg extends Document  {
    org_type: OrgType
    name: string
    contacts: string[]
    branches: IBranch[]
  }
  
  export enum OrgType {
    merchant = 'merchant',
    none = 'none'
  }