import { model, Schema, Document, Types } from 'mongoose';
import { CharacteristicsValueType, Product, Unit } from '@interfaces/product.interface';
import { StockItem } from '@/interfaces/stock.interface';

const StockItemSchema: Schema = new Schema({
  product_uz: {
    type: String,
  },
  product_ru: {
    type: String,
  },
  slug_ru: {
    type: String,
    required: true
  },
  slug_uz: {
    type: String,
    required: true
  },
  product_id: {
    type: Number //Schema.Types.ObjectId,
    // ref: "Product",
    // required: true
  },
  filters: {
    type: [{
      filter__id: String,
      filter_value_id: String
  }],
  default: []
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    required: true
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  images: {
    type: [{
      name: String,
      url: String
    }],
    default: []
  },
  categories: [String],
  article: String,
  code: String,
  code_ikpu: String,
  description_uz: String,
  description_ru: String,
  main_photo: String,
  brand: String,
  additional_description_uz: String,
  additional_description_ru: String,
}, {
  timestamps: true
});

const StockItemModel = model<StockItem & Document>('StockItem', StockItemSchema);

export default StockItemModel;
