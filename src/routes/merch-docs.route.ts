import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import multer from 'multer'
import MerchDocsController from '@/controllers/merch-doc.controller';

const storage = multer.diskStorage({
  destination: (req :any , file : any, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploads = multer({ storage: storage });


class MerchDocsRoute implements Routes {
  public path = '/merch-docs';
  public router = Router();
  public merchDocsController = new MerchDocsController()

  constructor() {
    this.initializeRoutes();
  }
  
private initializeRoutes() {
    this.router.get(`${this.path}`, this.merchDocsController.getAllmerchDocs);
    this.router.get(`${this.path}/barcode`, this.merchDocsController.findProductWithBarCode);
    this.router.post(`${this.path}`, this.merchDocsController.saveNewmerchDoc);
    this.router.put(`${this.path}`, this.merchDocsController.acceptmerchDocUpload);
    this.router.put(`${this.path}/load-doc-to-cell`, this.merchDocsController.loadDocProductsToCell)
    this.router.post(`${this.path}/import-accept-excel`, uploads.single('file'),  this.merchDocsController.importAcceptExcel)
    this.router.put(`${this.path}/start-doc-accepting`, this.merchDocsController.startDocsAccepting)
    this.router.post(`${this.path}/ping-doc`, this.merchDocsController.pingDoc)
    this.router.post(`${this.path}/send-address-ws`, this.merchDocsController.sendAddress)
    this.router.get(`${this.path}/get-started-doc`, this.merchDocsController.getStartedDoc)
    
  }
}

export default MerchDocsRoute;
