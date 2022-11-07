import { NextFunction, Request, Response } from 'express';
import CustomerService from '@/services/customers.service';
import { ICustomer } from '@/interfaces/customer.interface';
import { CreateCustomerDto } from '@/dtos/customers.dto';

class CustomersController {
  public customerService = new CustomerService()
  public getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCustomers: ICustomer[] = await this.customerService.findAllcustomers()
      res.status(200).json({ data: allCustomers, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerData: CreateCustomerDto = req.body
      const createCustomerData: ICustomer = await this.customerService.createCustomer(customerData)
      res.status(201).json({ data: createCustomerData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }
}

export default CustomersController;
