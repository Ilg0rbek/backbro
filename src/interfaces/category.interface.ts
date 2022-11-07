// import { FilterCombination, FilterTypes } from "@/models/categories.model";
import { Document } from "mongoose";
import { CategoryFilters } from "./filters.interface";

export interface Category extends Document {
  name_uz: string
  name_en: string
  name_ru: string
  filters: CategoryFilters['_id'][],
  parent: string;
  category: string;
  active_state: boolean
  is_deleted: boolean
}
