import { NextFunction, Request, Response } from 'express';
import { StockItem } from '@/interfaces/stock.interface';
import { wrSocket } from '@/server';
import MerchDocsService from '@/services/merch-doc.service';
import { IMerchDoc } from '@/interfaces/merch-doc.interface';
class MerchDocsController {
  public merchDcosService = new MerchDocsService();

  public sendAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      wrSocket.socket.emit('cell-address', req.body.address);
      res.status(200).json({ data: 'Ok address sent' });
    } catch (error) {
      next(error);
    }
  };

  public getStartedDoc = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const startedDoc = await this.merchDcosService.getStartedDoc();
      res.status(200).json(startedDoc);
    } catch (error) {
      next(error);
    }
  };
  public pingDoc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      wrSocket.socket.emit('update-scanned-info', JSON.stringify(req.body));
      res.status(200).json({ data: 'Ok sent' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  public startDocsAccepting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startedDocs = await this.merchDcosService.startAcceptingGivenDocs(req.body);
      res.status(200).json({ data: startedDocs, message: 'docs accepting started' });
    } catch (error) {
      next(error);
    }
  };

  public getAllmerchDocs = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const allItems: IMerchDoc[] = await this.merchDcosService.getAllCells();
      res.status(200).json({ data: allItems, message: 'merchDocs list' });
    } catch (error) {
      next(error);
    }
  };

  public loadDocProductsToCell = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedData = await this.merchDcosService.loadDocProductsToCell(req.body);
      res.status(201).json({ data: updatedData, message: 'Update' });
    } catch (error) {
      next(error);
    }
  };

  public saveNewmerchDoc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newmerchDoc: IMerchDoc = await this.merchDcosService.saveNewmerchDoc(req.body);
      res.status(200).json({ data: newmerchDoc, message: 'new merchDoc Saved' });
    } catch (error) {
      next(error);
    }
  };

  public acceptmerchDocUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newmerchDoc: IMerchDoc[] = await this.merchDcosService.acceptmerchDocUpload(req.body);
      res.status(200).json({ data: newmerchDoc, message: 'new merchDoc Saved' });
    } catch (error) {
      next(error);
    }
  };

  public findProductWithBarCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const theProduct: StockItem = await this.merchDcosService.findProductWithBarCode(req.query);
      res.status(200).json({ data: theProduct, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public importAcceptExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.merchDcosService.importAcceptExcel(req.file.filename, req.body);
      res.status(201).json({ data: 'product import excel file uploaded', message: 'upload' });
    } catch (error) {
      next(error);
    }
  };
}

export default MerchDocsController;
