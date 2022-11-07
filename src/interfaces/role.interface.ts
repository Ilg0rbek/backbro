import { Document } from "mongoose"

export interface IAction extends Document {
    uri: string
    permission: boolean
}

export interface IModule extends Document {
    uri: string
    permission: boolean
    actions: IAction[]
}

export interface IRole extends Document {
    title_uz: string
    title_en: string
    title_ru: string
    modules: IModule[]
}