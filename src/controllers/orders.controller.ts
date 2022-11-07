import { NextFunction, Request, Response } from 'express';
import OrderService from '@/services/orders.service';
import { IOrder } from '@/interfaces/order.iterface';
import { CreateOrderDto } from '@/dtos/orders.dto';
import StockService from '@/services/stock.service';
import { wrSocket } from '@/server';
import CellService from '@/services/cell.service';
import { ICell } from '@/interfaces/cell.interface';

class OrdersController {
  public orderService = new OrderService();
  public stockService = new StockService();
  public cellService = new CellService();


  public updateOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedOrders = await this.orderService.updateOrders(req.body)
      res.status(201).json({data: updatedOrders, message: 'orders updated'})
    } catch (error) {
      
    }
  }

  public getCellsForCollectingOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cellsForCollectingOrders: ICell[] = await this.cellService.getAllCellsForOrderCollecting(req.body); // body has _ids of stock items which are products
      res.status(200).json(cellsForCollectingOrders);
    } catch (error) {
      next(error);
    }
  };

  public setOrderProductWs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      wrSocket.socket.emit('order-set-scanned-product-ws',  req.body);
      res.status(200).json({ data: 'Ok address sent' });
    } catch (error) {
      next(error);
    }
  };

  public setCellInfoWs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      wrSocket.socket.emit('order-set-cells-info-ws', req.body);
      res.status(200).json({ data: 'Ok address sent' });
    } catch (error) {
      next(error);
    }
  };

  public setStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const changedOrder = await this.orderService.setStatus(req.body);
      res.status(200).json({ data: changedOrder, message: 'Status updated' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  public setStartCollecting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderUpdatedData = await this.orderService.setStartCollecting(req.body);
      res.status(200).json({ data: orderUpdatedData, message: 'Collecting started set' });
    } catch (error) {
      next(error);
    }
  };

  public getStatusesCount = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const statusesCount = await this.orderService.statusesCount();
      res.status(200).json({ data: statusesCount, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  

  public getOrderCollectingStarted = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const allOrders: IOrder[] = await this.orderService.findAllOrdersCollectingStarted();
      res.status(200).json({ data: allOrders, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allOrders: IOrder[] = await this.orderService.findAllOrders(req.query);
      res.status(200).json({ data: allOrders, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: CreateOrderDto = req.body;
      const createOrderData: IOrder = await this.orderService.createOrder(orderData);
      res.status(201).json({ data: createOrderData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData = req.body;
      const createOrderData: IOrder = await this.orderService.deleteOrder(orderData);
      res.status(201).json({ data: createOrderData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search_text = req.query.search_text;
      const searchResult = await this.stockService.searchForProduct(search_text ? (search_text as string) : null);
      res.status(200).json({ data: searchResult, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default OrdersController;
