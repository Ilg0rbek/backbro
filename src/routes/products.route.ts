import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// import validationMiddleware from '@middlewares/validation.middleware';
import ProductController from '@/controllers/product.controller';
// import { EditProductDto } from '@/dtos/products.dto';

import multer from 'multer'
// import { CreateProductDto } from '@/dtos/products.dto';


const storage = multer.diskStorage({
  destination: (req :any , file : any, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploads = multer({ storage: storage });

class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public productController = new ProductController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Orgs 
    this.router.get(`${this.path}`, this.productController.getProducts);
    this.router.post(`${this.path}`, this.productController.createProduct);
    this.router.put(`${this.path}`, this.productController.EditProduct);
    this.router.post(`${this.path}/import-products`, uploads.single('file'), this.productController.fileUpload)
    // this.router.delete(`${this.path}`, validationMiddleware(DeleteCategoryDto, 'body'), this.productController.deleteCategory);
  }
}

export default ProductRoute;
