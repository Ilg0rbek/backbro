import { NextFunction, Request, Response } from 'express';
import CellService from '@/services/cell.service';
import { ICell } from '@/interfaces/cell.interface';
class CellController {
  public cellService = new CellService();

  public getAllCells = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const allItems: ICell[] = await this.cellService.getAllCells();
      res.status(200).json({ data: allItems, message: 'Cells list' });
    } catch (error) {
      next(error);
    }
  };

  public updateCells = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateResult = await this.cellService.updateCells(req.body);
      res.status(201).json({ data: updateResult, message: 'cell updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default CellController;
