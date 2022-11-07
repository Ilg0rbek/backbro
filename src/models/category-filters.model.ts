import { CategoryFilters } from '@/interfaces/filters.interface';
import { model, Schema, Document, Types } from 'mongoose';

export enum FilterTypes {
  checkbox = 'checkbox'
}

export enum FilterCombination {
  only_text = 1,
  image_text = 2
}

const categoryFiltersSchema: Schema = new Schema({
  filter_title_uz: String,
  filter_title_ru: String,
  filter_type: {
    type: String,
    enum: FilterTypes,
    default: FilterTypes.checkbox
  },
  combination: {
    type: Number,
    enum: FilterCombination,
    default: FilterCombination.only_text
  },
  filter_values: {
    type: [{
      title_uz: String,
      title_ru: String,
      image: String
    }],
    default: []
  }
}, {
  timestamps: true
});

const categoryFiltersModel = model<CategoryFilters & Document>('CategoryFilters', categoryFiltersSchema);
export default categoryFiltersModel;
