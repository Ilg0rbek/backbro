import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import CustomersController from '@/controllers/customers.controller';
import { CreateCustomerDto } from '@/dtos/customers.dto';

class CustomersRoute implements Routes {
  public path = '/customers';
  public router = Router();
  public customersController = new CustomersController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.customersController.getCustomers);
    this.router.post(`${this.path}`, this.customersController.createCustomer);
  }
}

export default CustomersRoute;
