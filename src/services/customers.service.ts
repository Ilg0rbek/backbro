import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import customerModel from '@/models/customers.model';
import { ICustomer } from '@/interfaces/customer.interface';
import { CreateCustomerDto } from '@/dtos/customers.dto';


class CustomerService {
    public customers = customerModel

    public async findAllcustomers(): Promise<ICustomer[]> {
        const  customers: ICustomer[] = await this.customers.find();
        return  customers;
    }
    public async createCustomer(customerData: CreateCustomerDto): Promise<ICustomer> {
        if (isEmpty(customerData)) throw new HttpException(400, "You're not roleData");
        const createOrgData: ICustomer = await this.customers.create(customerData);
        return createOrgData;
    }
    // public async updateOrg(customerData: UpdateOrgDto): Promise<IOrg> {
    //     if (isEmpty(customerData)) throw new HttpException(400, "You're not roleData");
        
    //     return updatedOrgData;
    // }
}

export default CustomerService;
