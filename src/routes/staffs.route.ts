import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateStaffDto, UpdateStaffDto } from '@/dtos/staffs.dto';
import StaffsController from '@/controllers/staffs.controller';

class OrgsRoute implements Routes {
  public path = '/staffs';
  public router = Router();
  public staffsController = new StaffsController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Orgs 
    this.router.get(`${this.path}`, this.staffsController.getStaffs);
    this.router.post(`${this.path}`, validationMiddleware(CreateStaffDto, 'body'), this.staffsController.createStaff);
    this.router.put(`${this.path}`, validationMiddleware(UpdateStaffDto, 'body'), this.staffsController.updateOrg);
    // this.router.delete(`${this.path}`, validationMiddleware(DeleteRoleDto, 'body'), this.rolesController.deleteRole);
  }
}

export default OrgsRoute;
