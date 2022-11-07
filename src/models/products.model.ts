import { model, Schema, Document } from 'mongoose';
import { CharacteristicsValueType, Product, Unit } from '@interfaces/product.interface';

const productSchema: Schema = new Schema({
  name_uz: {
    type: String,
  },
  name_ru: {
    type: String,
  },
  characteristics: {
    type: [{
      name_uz: String,
      name_ru: String,
      is_common: {
        type: Boolean,
        default: false
      },
      ch_type: {
        type: String,
        enum: CharacteristicsValueType,
        default: CharacteristicsValueType.text
      },
      variants: {
        type: [{
          v_title_uz: String,
          v_title_ru: String,
          v_value: String,
          v_photo: String,
        }],
        default: []
      }
    }],
    default: []
  },
  article: String,
  code: String,
  code_ikpu: String,
  description_uz: String,
  description_ru: String,
  main_photo: String,
  brand: String,
  categories: [String]
}, {
  timestamps: true
});

const productModel = model<Product & Document>('Product', productSchema);

export default productModel;
