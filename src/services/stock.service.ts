import { CreateStockItemDto } from '@/dtos/stock.dto';
import { IOrderStockItem, StockItem } from '@/interfaces/stock.interface';
import StockItemModel from '@/models/stock.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from 'class-validator';
import { Types } from 'mongoose';
import slugify from 'slugify';
import excelToJson from 'convert-excel-to-json'


class StockService {
    public stockItems = StockItemModel;

    public async updateImagesProduct(images: StockItem['images'], stock_id: string): Promise<string> {
        await this.stockItems.updateOne({
            _id: new Types.ObjectId(stock_id + '')
        }, {
            $set: {
                images: images
            }
        })
        return 'updated'
    }

    public async importExcelProducts(filename: string, merchant: any): Promise<string> {
        try {

            console.log("MERCHANT", merchant)
            const result = excelToJson({
                sourceFile: './uploads/' + filename,
                header: {
                    rows: 1
                },
                sheets: [{
                    name: 'Products',
                    columnToKey: {
                        A: 'product_id',
                        B: 'categories',
                        C: 'brand',
                        D: 'product_ru',
                        E: 'product_uz',
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
            console.log("products", products)
            const characteristics = result.Characteristics
            const variants = result.Variants
            const categories = result.Catalogs

            for (let i = 0; i < characteristics.length; i++) {
                const vars = variants.filter((v: any) => v.characteristics_id === characteristics[i].characteristics_id && v.product_id === characteristics[i].product_id)
                characteristics[i].variants = vars
            }

            for (let i = 0; i < products.length; i++) {
                const chars = characteristics.filter((ch: any) => ch.product_id === products[i].product_id)
                products[i].characteristics = chars
                const cats = categories.filter((cat: any) => {
                    return products[i].categories.split(' ').map((c: string) => Number(c)).find((c: number) => c === Number(cat.catalog_id))
                }).map((cats: any) => cats.category)
                products[i].categories = cats

                products[i].slug_uz = slugify(products[i].product_uz, { locale: 'uz' })
                products[i].slug_ru = slugify(products[i].product_ru)
                products[i].merchant = merchant.merchant
                products[i].discount = 0
                products[i].code_ikpu = products[i].code_ikpu+''
            }

            await this.stockItems.create(products)

            return 'Ok'
        } catch (error) {
            throw error
        }
    }

    public async searchForProduct(search_text: string | null): Promise<IOrderStockItem[]> {
        if (search_text) {
            const products = await this.stockItems.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                product_ru: { $regex: search_text, $options: "i" }
                            },
                            {
                                product_uz: { $regex: search_text, $options: "i" }
                            }
                        ]
                    }
                }, {
                    $lookup: {
                        from: 'orgs',
                        localField: 'merchant',
                        foreignField: '_id',
                        as: 'merchant',
                        pipeline: [{
                            $project: {
                                name: 1
                            }
                        }]
                    }
                }, {
                    $unwind: {
                        path: '$merchant'
                    }
                }, {
                    $match: {
                        quantity: {
                            $gt: 0
                        }
                    }
                },
                {
                    $project: {
                        product_uz: 1,
                        product_ru: 1,
                        quantity: 1,
                        merchant: 1,
                        price: 1
                    }
                }
            ])
            return products;
        }
        return [];
    }

    public async getAllStockItems(current_merchant: string | null): Promise<StockItem[]> {
        if (current_merchant) {
            return await this.stockItems.aggregate([{
                $match: {
                    merchant: new Types.ObjectId(current_merchant)
                }
            }, {
                $lookup: {
                    from: 'orgs',
                    localField: 'merchant',
                    foreignField: '_id',
                    as: 'merchant'
                }
            }])
        } else {
            return await this.stockItems.aggregate([
                {
                  '$unwind': {
                    'path': '$categories'
                  }
                }, {
                  '$lookup': {
                    'from': 'categories', 
                    'localField': 'categories', 
                    'foreignField': 'category', 
                    'as': 'categories', 
                    'pipeline': [
                      {
                        '$project': {
                          'category': 1, 
                          'name_uz': 1, 
                          'name_ru': 1, 
                          'filters': 1
                        }
                      }
                    ]
                  }
                }, {
                  '$unwind': {
                    'path': '$categories'
                  }
                }, {
                  '$set': {
                    'cat_filters': '$categories.filters'
                  }
                }, {
                  '$group': {
                    '_id': '$_id', 
                    'categories': {
                      '$push': '$categories'
                    }, 
                    'filters_to_choose': {
                      '$push': '$cat_filters'
                    }, 
                    'article': {
                      '$first': '$article'
                    }, 
                    'brand': {
                      '$first': '$brand'
                    }, 
                    'filters': {
                      '$first': '$filters'
                    }, 
                    'code': {
                      '$first': '$code'
                    }, 
                    'code_ikpu': {
                      '$first': '$code_ikpu'
                    }, 
                    'createdAt': {
                      '$first': '$createdAt'
                    }, 
                    'description_uz': {
                      '$first': '$description_uz'
                    }, 
                    'description_ru': {
                      '$first': '$description_ru'
                    }, 
                    'discount': {
                      '$first': '$discount'
                    }, 
                    'merchant': {
                      '$first': '$merchant'
                    }, 
                    'price': {
                      '$first': '$price'
                    }, 
                    'product_id': {
                      '$first': '$product_id'
                    }, 
                    'product_ru': {
                      '$first': '$product_ru'
                    }, 
                    'product_uz': {
                      '$first': '$product_uz'
                    }, 
                    'quantity': {
                      '$first': '$quantity'
                    }, 
                    'slug_ru': {
                      '$first': '$slug_ru'
                    }, 
                    'slug_uz': {
                      '$first': '$slug_uz'
                    }, 
                    'updatedAt': {
                      '$first': '$updatedAt'
                    }, 
                    'images': {
                      '$first': '$images'
                    }
                  }
                }, {
                  '$set': {
                    'filters_to_choose': {
                      '$reduce': {
                        'input': '$filters_to_choose', 
                        'initialValue': [], 
                        'in': {
                          '$concatArrays': [
                            '$$value', '$$this'
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'orgs', 
                    'localField': 'merchant', 
                    'foreignField': '_id', 
                    'as': 'merchant'
                  }
                }, {
                  '$set': {
                    'filters_to_choose': {
                      '$setUnion': [
                        '$filters_to_choose', []
                      ]
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'categoryfilters', 
                    'localField': 'filters_to_choose', 
                    'foreignField': '_id', 
                    'as': 'filters_to_choose'
                  }
                }, {
                  '$unwind': {
                    'path': '$merchant'
                  }
                }
              ])
        }
    }

    public async createStockItem(stockItemData: CreateStockItemDto): Promise<StockItem> {
        if (isEmpty(stockItemData)) throw new HttpException(400, "You're not product data");
        stockItemData.slug_uz = slugify(stockItemData.product_uz, { locale: 'uz' })
        stockItemData.slug_ru = slugify(stockItemData.product_ru)
        const createStockItemData = await this.stockItems.create(stockItemData);
        return createStockItemData;
    }

    public async deleteStockItem(stockItemId: any): Promise<any> {
        if (isEmpty(stockItemId)) throw new HttpException(400, "You're not product data");
        const deletetockItemData = await this.stockItems.findByIdAndDelete(stockItemId.stock_item_id);
        return deletetockItemData;
    }

    public async updateStockItem(stockItemData: any): Promise<StockItem> {
        if (isEmpty(stockItemData)) throw new HttpException(400, "You're not product data");
        console.log("stockItem update", stockItemData)
        stockItemData.slug_uz = slugify(stockItemData.product_uz, { locale: 'uz' })
        stockItemData.slug_ru = slugify(stockItemData.product_ru)
        const createStockItemData = await this.stockItems.findByIdAndUpdate(stockItemData._id, {
            $set: {
                ...stockItemData
            }
        });
        return createStockItemData;
    }


}


export default StockService