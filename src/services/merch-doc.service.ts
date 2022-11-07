import StockItemModel from '@/models/stock.model';
import { Types } from 'mongoose';
import excelToJson from 'convert-excel-to-json';
import { StockItem } from '@/interfaces/stock.interface';
import docsModel from '@/models/merch-docs';
import { IMerchDoc } from '@/interfaces/merch-doc.interface';

class MerchDocsService {
  public merchDoc = docsModel; // merch doc
  public stockItem = StockItemModel;

  public async loadDocProductsToCell(doc: IMerchDoc): Promise<any> {
    try {
      const docsUpdated = await this.merchDoc
        .updateOne(
          {
            _id: new Types.ObjectId(doc._id),
          },
          {
            $set: {
              ...doc,
              accepted: true,
            },
          },
        )
        .exec();
      for (let i = 0; i < doc.products.length; i++) {
        await this.stockItem.updateOne(
          {
            code: doc.products[i].barcode,
            article: doc.products[i].article,
            merchant: new Types.ObjectId(doc.merchant._id),
          },
          {
            $inc: {
              quantity: doc.products[i].quantity,
            },
          },
        );
      }
      return docsUpdated;
    } catch (error) {
      return error;
    }
  }

  public async importAcceptExcel(filename: string, doc_body: any): Promise<string> {
    try {
      console.dir('Importing doc from excel', JSON.parse(doc_body.body));
      const main_data = JSON.parse(doc_body.body);
      // article: {
      //     type: String,
      //     required: true
      // },
      // barcode: {
      //     type: String,
      //     required: true
      // },
      // product_id: {
      //     type: Types.ObjectId,
      //     ref: 'StockItem'
      // },
      // quantity: {
      //     type: Number,
      //     required: true
      // }

      const result = excelToJson({
        sourceFile: './uploads/' + filename,
        header: {
          rows: 1,
        },
        sheets: [
          {
            name: 'Products',
            columnToKey: {
              A: 'article',
              B: 'barcode',
              C: 'quantity',
              D: 'product_id',
            },
          },
        ],
      });
      const newdoc_products = result.Products;
      console.log('newdoc_products: !!!!', newdoc_products);
      if (newdoc_products.length === 0) {
        throw 'Document is empty or first sheet name is not Products';
      }
      for (let i = 0; i < newdoc_products.length; i++) {
        console.log('products - ' + i, newdoc_products[i]);
        newdoc_products[i].product_id = (
          await this.stockItem.findOne({ code: new RegExp(newdoc_products[i].barcode, 'i'), article: new RegExp(newdoc_products[i].article) }).exec()
        )?._id;
        newdoc_products[i].product_id = newdoc_products[i].product_id ? newdoc_products[i].product_id : '';
        console.log(newdoc_products[i].product_id);
        if (!newdoc_products[i].product_id) {
          throw 'could not found products';
          return;
        }
      }

      await this.merchDoc.create({
        ...main_data,
        address: 'temp address',
        products: newdoc_products,
      });
      return 'Ok';
    } catch (error) {
      throw error;
    }
  }

  public async startAcceptingGivenDocs(doc: { _id: string }): Promise<any> {
    const result = await this.merchDoc.updateOne(
      {
        _id: new Types.ObjectId(doc._id),
      },
      {
        $set: {
          started: true,
        },
      },
    );
    return result;
  }

  public async getStartedDoc(): Promise<any> {
    const aa = await this.merchDoc.findOne({ started: true }).exec();
    console.log('asasasd', aa);
    return aa;
  }

  public async getAllCells(): Promise<IMerchDoc[]> {
    const merchDocs = await this.merchDoc.aggregate([
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $lookup: {
          from: 'stockitems',
          localField: 'products.product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$product',
        },
      },
      {
        $group: {
          _id: '$_id',
          products: {
            $push: {
              quantity: '$products.quantity',
              barcode: '$products.barcode',
              article: '$products.article',
              product: '$product',
              scanned: '$products.scanned',
            },
          },
          accepted: {
            $first: '$accepted',
          },
          started: {
            $first: '$started',
          },
          expected_date: {
            $first: '$expected_date',
          },
          merchant: {
            $first: '$merchant',
          },
          finishedDate: {
            $first: '$finishedDate',
          },
          doc_num: {
            $first: '$doc_num',
          },
          acceptedDate: {
            $first: '$acceptedDate',
          },
          address: {
            $first: '$address',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
        },
      },
      {
        $lookup: {
          from: 'orgs',
          localField: 'merchant',
          foreignField: '_id',
          as: 'merchant',
        },
      },
      {
        $unwind: {
          path: '$merchant',
        },
      },
    ]);

    return merchDocs;
  }

  public async findProductWithBarCode(query: any): Promise<StockItem> {
    const item = await this.stockItem.findOne({ code: query.barcode }).select('product_uz product_ru article code brand merchant').exec();
    return item;
  }

  public async saveNewmerchDoc(merchDocData: any): Promise<IMerchDoc> {
    const merchDocs = await this.merchDoc.create(merchDocData);
    return merchDocs;
  }

  public async acceptmerchDocUpload(merchDocData: any): Promise<any> {
    const merchDocsForStockItem = await this.merchDoc.aggregate([
      {
        $match: {
          _id: {
            $in: merchDocData.merchDocs.map((c: any) => new Types.ObjectId(c)),
          },
        },
      },
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $group: {
          _id: '$products.product_id',
          quantity: {
            $first: '$products.quantity',
          },
        },
      },
    ]);

    const merchDocs = await this.merchDoc.updateMany(
      {
        _id: {
          $in: merchDocData.merchDocs.map((c: any) => new Types.ObjectId(c)),
        },
      },
      {
        $set: {
          accepted: true,
        },
      },
    );

    console.log('merchDocsForStockItem', merchDocsForStockItem);

    for (let i = 0; i < merchDocsForStockItem.length; i++) {
      await this.stockItem.findByIdAndUpdate(merchDocsForStockItem[i]._id, {
        $inc: {
          quantity: merchDocsForStockItem[i].quantity,
        },
      });
    }

    return merchDocs;
  }
}

export default MerchDocsService;
