import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StockItemController from '@/controllers/stock.controller';
import multer from 'multer'


const storage = multer.diskStorage({
  destination: (req :any , file : any, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploads = multer({ storage: storage });


class StockItemsRoute implements Routes {
  public path = '/stock-items';
  public router = Router();
  public stockItemController = new StockItemController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.stockItemController.getAllStockItems);
    this.router.put(`${this.path}/update-images-list-product`, this.stockItemController.updateImagesPrdocut);
    this.router.get(`${this.path}/search`, this.stockItemController.searchForProduct)
    this.router.get(`${this.path}/search-merchant`, this.stockItemController.searchForMerchant)
    this.router.get(`${this.path}/product`, this.stockItemController.getOneProduct)
    this.router.post(`${this.path}`,  this.stockItemController.createStockItem);
    this.router.post(`${this.path}/import-excel`, uploads.single('file'),  this.stockItemController.fileUpload);
    this.router.put(`${this.path}`,  this.stockItemController.updateStockItem);
    this.router.delete(`${this.path}`,  this.stockItemController.deleteStockItem);
  }
}

export default StockItemsRoute;
