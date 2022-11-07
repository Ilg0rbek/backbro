import { FilterCombination, FilterTypes } from "@/models/category-filters.model";
import { Document } from "mongoose";

export interface CategoryFilters extends Document {
    filter_title_uz: string
    filter_title_ru: string
    filter_type: FilterTypes
    combination: FilterCombination
    filter_values: {
      title_uz: string
      title_ru: string
      image: string
    }[]
}
