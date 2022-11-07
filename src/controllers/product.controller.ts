import { NextFunction, Request, Response } from 'express';
import { Product } from '@/interfaces/product.interface';
import ProductService from '@/services/products.service';
import { CreateProductDto, EditProductDto } from '@/dtos/products.dto';
// import productService from '@services/product.service';

class ProductController {
  public productsService = new ProductService()

  public fileUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productsService.importExcelProducts(req.file.filename)
      res.status(201).json({data: 'product import excel file uploaded', message: 'upload'})
    } catch (error) {
      next(error)
    }
  }

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search_text = req.query.search_text
      const category_path = req.query.category_path
      const findAllProducts: Product[] = await this.productsService.findAllProducts(search_text ? search_text as string: null, category_path ? category_path as string: null)
      res.status(200).json({ data: findAllProducts, message: 'findAll' })
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: CreateProductDto = req.body;
      console.log("productData", productData)
      const createdProducData: Product = await this.productsService.createProduct(productData);
      res.status(201).json({ data: createdProducData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public EditProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: EditProductDto = req.body;
      console.log("productData", productData)
      const createdProducData: Product = await this.productsService.EditProduct(productData);
      res.status(201).json({ data: createdProducData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  // public getUserById = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId: string = req.params.id;
  //     const findOneUserData: User = await this.userService.findUserById(userId);

  //     res.status(200).json({ data: findOneUserData, message: 'findOne' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public createUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userData: CreateUserDto = req.body;
  //     const createUserData: User = await this.userService.createUser(userData);

  //     res.status(201).json({ data: createUserData, message: 'created' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default ProductController
