import { Document } from "mongoose"

export enum Unit {
  gramm = 'gr',
  milligrams = 'mgr',
  meter = 'meter',
  cm = 'cm',
  inch = 'inch'
}

export enum CharacteristicsValueType {
  number = 'number',
  text = 'text',
  boolean = 'boolean',
  color = 'color',
  percent = 'percent', // 0-100
}

export interface ProductCharacteristics extends Document {
  name_uz: string
  name_ru: string
  is_common: boolean
  ch_type: CharacteristicsValueType
  variants: {
    v_title_uz: string
    v_title_ru: string
    value: string
    v_photo?: string
  }[]
}

export interface Product extends Document {
  name_ru: string
  name_uz: string
  article?: string
  code?: string
  code_ikpu?: string
  characteristics: ProductCharacteristics[]
  description_uz: string
  description_ru: string
  main_photo: string
  categories: string[] // uri-path/ uz-path / en-path / ru-path
  brand: string;
}
