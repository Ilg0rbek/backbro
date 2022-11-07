import { CreateProductDto, EditProductDto } from '@/dtos/products.dto';
import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/product.interface';
import productModel from '@models/products.model';
import { isEmpty } from 'class-validator';
import { Types } from 'mongoose';
import excelToJson from 'convert-excel-to-json'
import { StockItem } from '@/interfaces/stock.interface';

class ProductService {
  public products = productModel;



  public async importExcelProducts(filename: string): Promise<string> {
    try {
      const result = excelToJson({
        sourceFile: './uploads/'+filename,
        header: {
          rows: 1
        }, 
        sheets: [{
          name: 'Products',
          columnToKey: {
            A: 'product_id',
            B: 'categories',
            C: 'brand',
            D: 'name_ru',
            E: 'name_uz',
            F: "main_photo",
            G: "description_ru",
            H: 'description_uz',
            I: "article",
            J: "code",
            K: "code_ikpu"
          }
        }, {
          name: 'Characteristics',
          columnToKey: {
            A: 'product_id',
            B: 'characteristics_id',
            C: 'name_ru',
            D: 'name_uz',
            E: 'is_common',
            F: 'ch_type',
            G: 'variants'
          }
        }, {
          name: 'Variants',
          columnToKey: {
            A: 'product_id',
            B: 'characteristics_id',
            C: 'v_title_ru',
            D: 'v_title_uz',
            E: 'value',
            F: 'v_value',
            G: "v_photo",
          }
        }, {
          name: 'Catalogs',
          columnToKey: {
            A: 'catalog_id',
            D: 'category',
          }
        }]
      })
      const products = result.Products
      const characteristics = result.Characteristics
      const variants = result.Variants
      const categories = result.Catalogs

      for(let i = 0; i < characteristics.length; i++) {
        const vars = variants.filter((v: any) => v.characteristics_id === characteristics[i].characteristics_id && v.product_id ===  characteristics[i].product_id)
        characteristics[i].variants = vars
      }

      for(let i = 0; i < products.length; i++) {
        const chars = characteristics.filter((ch: any) => ch.product_id === products[i].product_id)
        products[i].characteristics = chars
        const cats = categories.filter((cat: any) => (products[i].categories + '').includes(cat.catalog_id+'')).map((cats: any) => cats.category)
        products[i].categories = cats
      }

      await this.products.create(products)

      return 'Ok'
    } catch (error) {
      throw error
    }
  }


  public async searchForProduct(search_text: string | null, category_path: string | null): Promise<Product[]> {
    if (search_text) {
      const products: Product[] = await this.products.aggregate([
        {
          $match: {
            $or: [
              {
                name_ru: { $regex: search_text, $options: "i" }
              },
              {
                name_uz: { $regex: search_text, $options: "i" }
              }
            ]
          }
        },
        {
          $project: {
            label_uz: '$name_uz',
            label_ru: '$name_ru',
            label: '$name_ru',
            value: '$_id'
          }
        }
      ])
      return products;
    }
    else if (category_path) {
      const products: Product[] = await this.products.aggregate([
        {
          $match: {
            $or: [
              {
                categories: { $regex: category_path, $options: "i" }
              }
            ]
          }
        },
        {
          $project: {
            label_uz: '$name_uz',
            label_ru: '$name_ru',
            label: '$name_ru',
            value: '$_id'
          }
        }
      ])
      return products;
    }
    return [];
  }

  public async getOneProduct(product_id: string): Promise<Product> {
    return await this.products.findOne({ _id: new Types.ObjectId(product_id) })
  }

  public async findAllProducts(search_text: string | null, category_path: string | null): Promise<Product[]> {
    // console.log("search_text: string | null, category_path: string | null", search_text, category_path)
    const products: Product[] = await this.products.aggregate([
      {
        $match: {
          $or: [
            // {
            //   name_ru: {$regex: search_text || '', $options: "i"}
            // },
            // {
            //   name_uz: {$regex: search_text || '', $options: "i" }
            // },
            {
              categories: { $regex: category_path || '', $options: "i" }
            }
          ]
        }
      },
      {
        $match: {
          $or: [
            {
              name_ru: { $regex: search_text || '', $options: "i" }
            },
            {
              name_uz: { $regex: search_text || '', $options: "i" }
            },
            // {
            //   categories: {$regex: category_path || '', $options: "i" }
            // }
          ]
        }
      },
    ])
    return products;
  }


  public async createProduct(productData: CreateProductDto): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, "You're not product data");
    const createproductData = await this.products.create(productData);
    return createproductData;
  }

  public async EditProduct(productData: EditProductDto): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, "You're not product data");
    console.log("productData edit", productData)
    const createproductData = await this.products.findByIdAndUpdate(productData._id, {
      $set: {
        ...productData
      }
    });
    return createproductData;
  }
}


export default ProductService