import StockItemModel from '@/models/stock.model';
import { Types } from 'mongoose';
import cellModel from '@/models/cell-storage';
import { ICell } from '@/interfaces/cell.interface';

class CellService {
  public cell = cellModel;
  public stockItem = StockItemModel;

  /**
   * TODO:
   * 1. loop though given cells
   * 2. check if cell is there
   * 3. if cell is not there create new
   * 4. else if cell is there then update only products list
   * 5 go each product list if there is a given product then increase quantity of it by given quantity
   * 6. if there is not given product just create one with push
   * 7. update cell
   * 8. return with modifications
   */
  public async updateCells(cells: ICell[]): Promise<ICell['id'][]> {
    try {
      console.log('Cells', cells);
      const cells_ids: ICell['_id'][] = [];
      for (let c = 0; c < cells.length; c++) {
        const address = new RegExp(`^${cells[c].address}$`);
        console.log('addres', address);
        const cell = await this.cell
          .findOne({
            address: {
              $regex: address,
              $options: '',
            },
          })
          .exec();
        console.log('CELL', cell);
        if (cell) {
          cells_ids.push(cell._id);
          const incoming_products_list = cells[c].products;
          for (let inc_pr = 0; inc_pr < incoming_products_list.length; inc_pr++) {
            const availablePrIndex = cell.products.findIndex((pr: any) => {
              return pr.barcode.includes(incoming_products_list[inc_pr].barcode) && pr.article.includes(incoming_products_list[inc_pr].article);
            });
            if (availablePrIndex >= 0) {
              cell.products[availablePrIndex].quantity += incoming_products_list[inc_pr].quantity;
              await cell.save();
            } else {
              await cell
                .updateOne({
                  $push: {
                    products: incoming_products_list[inc_pr],
                  },
                })
                .exec();
              //  await cell.save()
            }
          }
        } else {
          const newCell = await this.cell.create(cells[c]);
          console.log('New Cell', newCell);
          cells_ids.push(newCell._id);
        }
      }
      return cells_ids;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getAllCellsForOrderCollecting(product_ids: string[]): Promise<ICell[]> {
    console.log("Getting Cells of the products, ", product_ids)
    const cells = await this.cell.aggregate([
      {
        $unwind: {
          path: '$products'
        }
      }, {
        $match: {
          'products.product_id': {
            $in: product_ids.map((pr_id: string) => new Types.ObjectId(pr_id))
          }
        }
      }, {
        $set: {
          'products.scanned': 0
        }
      }, {
        $group: {
          _id: '$_id',
          products: {
            $push: '$products'
          },
          address: {
            $first: '$address'
          }
        }
      }
    ])
    return cells
  }

  public async getAllCells(): Promise<ICell[]> {
    const cells = await this.cell.aggregate([
      {
        $match: {
          accepted: false,
        },
      },
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
              scanned: 0,
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
    return cells;
  }
}

export default CellService;
