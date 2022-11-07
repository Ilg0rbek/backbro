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

import { NextFunction, Request, Response } from 'express';

const fileUploadMiddleware = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        
    } catch (error) {
        
    }
}