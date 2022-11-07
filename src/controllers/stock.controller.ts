import { NextFunction, Request, Response } from 'express';
import StockService from '@/services/stock.service';
import { StockItem } from '@/interfaces/stock.interface';
import { CreateStockItemDto } from '@/dtos/stock.dto';
import ProductService from '@/services/products.service';
import OrgService from '@/services/orgs.service';

class StockItemController {
  public stockService = new StockService()
  public productService = new ProductService()
  public merchants  = new OrgService()


  public updateImagesPrdocut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stock_id = req.query.stock_id
      const images = req.body.images as StockItem['images']
      const updateResult = await this.stockService.updateImagesProduct(images, stock_id+'')
      res.status(200).json({ data: updateResult, message: 'images updated' })
    } catch (error) {
      next(error)
    }
  }

  public searchForMerchant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search_text = req.query.search_text
      const merchants = await this.merchants.searchMerchant(search_text ? search_text as string: null)
      res.status(200).json({data: merchants, message:  "Search merchant"})
    } catch (error) {
      next(error)
    }
  }

  public fileUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.stockService.importExcelProducts(req.file.filename, req.body)
      res.status(201).json({data: 'product import excel file uploaded', message: 'upload'})
    } catch (error) {
      next(error)
    }
  }

  public searchForProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search_text = req.query.search_text
      const category_path = req.query.category_path
      const searchResult = await this.productService.searchForProduct(search_text ? search_text as string: null, category_path ? category_path as string: null)
      res.status(200).json({ data: searchResult, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.query.product_id
      const searchResult = await this.productService.getOneProduct(product_id ? product_id as string: null)
      res.status(200).json({ data: searchResult, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  public getAllStockItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const current_merchant = req.query.current_merchant
      const allItems: StockItem[] = await this.stockService.getAllStockItems(current_merchant ? current_merchant as string: null)
      res.status(200).json({ data: allItems, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createStockItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockItemData: CreateStockItemDto = req.body
      const createStockItemData: StockItem = await this.stockService.createStockItem(stockItemData)
      res.status(201).json({ data: createStockItemData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  

  public updateStockItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockItemData = req.body
      const createStockItemData: StockItem = await this.stockService.updateStockItem(stockItemData)
      res.status(201).json({ data: createStockItemData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public deleteStockItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockItemId = req.body
      const deletedStockItemData = await this.stockService.deleteStockItem(stockItemId)
      res.status(201).json({ data: deletedStockItemData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default StockItemController;
