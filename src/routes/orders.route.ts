import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import OrdersController from '@/controllers/orders.controller';

class OrdersRoute implements Routes {
  public path = '/orders';
  public router = Router();
  public ordersController = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.ordersController.getOrders);
    this.router.put(`${this.path}`, this.ordersController.updateOrders);
    this.router.get(`${this.path}/collecting-started`, this.ordersController.getOrderCollectingStarted);
    this.router.post(`${this.path}/get-cells-for-order-collection`, this.ordersController.getCellsForCollectingOrder)
    this.router.get(`${this.path}/statuses_count`, this.ordersController.getStatusesCount);
    this.router.put(`${this.path}/set-start-collecting`, this.ordersController.setStartCollecting);
    this.router.put(`${this.path}/set_status`, this.ordersController.setStatus);
    this.router.post(`${this.path}`, this.ordersController.createOrder);
    this.router.delete(`${this.path}`, this.ordersController.deleteOrder);
    this.router.get(`${this.path}/search_product`, this.ordersController.searchProduct);
    this.router.post(`${this.path}/set-scanned-product-ws`, this.ordersController.setOrderProductWs);
    this.router.post(`${this.path}/set-cells-info-ws`, this.ordersController.setCellInfoWs);
  }
}

export default OrdersRoute;
