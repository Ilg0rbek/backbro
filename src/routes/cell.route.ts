import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CellController from '@/controllers/cell.controller';
//import multer from 'multer'

// const storage = multer.diskStorage({
//   destination: (req :any , file : any, cb) => {
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });
// const uploads = multer({ storage: storage });


class CellRoute implements Routes {
  public path = '/cells';
  public router = Router();
  public cellController = new CellController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.cellController.getAllCells);
    this.router.put(`${this.path}/multiple`, this.cellController.updateCells) 
  }
}
export default CellRoute;
