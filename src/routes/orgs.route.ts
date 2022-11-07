import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import OrgsController from '@/controllers/orgs.controller';
import { CreateOrgDto, UpdateOrgDto } from '@/dtos/orgs.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class OrgsRoute implements Routes {
  public path = '/orgs';
  public router = Router();
  public orgsController = new OrgsController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Orgs 
    this.router.get(`${this.path}`, this.orgsController.getOrgs);
    this.router.post(`${this.path}`, validationMiddleware(CreateOrgDto, 'body'), this.orgsController.createOrg);
    this.router.put(`${this.path}`, validationMiddleware(UpdateOrgDto, 'body'), this.orgsController.updateOrg);
    // this.router.delete(`${this.path}`, validationMiddleware(DeleteRoleDto, 'body'), this.rolesController.deleteRole);
  }
}

export default OrgsRoute;
