import { Router } from 'express';
import RolesController from '@controllers/roles.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateActionDto, CreateModuleDto, CreateRoleDto, DeleteActionOfModuleDto, DeleteModuleDto, DeleteRoleDto, ToggleActionOfModuleOfRoleDto, ToggleModuleOfRoleDto, UpdateActionOfModuleDto, UpdateModuleDto, UpdateRoleDto } from '@/dtos/roles.dto';

class RolesRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public rolesController = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Roles 
    this.router.get(`${this.path}`, this.rolesController.getRoles);
    this.router.post(`${this.path}`, validationMiddleware(CreateRoleDto, 'body'), this.rolesController.createRole);
    this.router.put(`${this.path}`, validationMiddleware(UpdateRoleDto, 'body'), this.rolesController.updateRole);
    this.router.delete(`${this.path}`, validationMiddleware(DeleteRoleDto, 'body'), this.rolesController.deleteRole);

    // Modules
    this.router.post(`${this.path}/module`, validationMiddleware(CreateModuleDto, 'body'), this.rolesController.addModuleToRoles);
    this.router.put(`${this.path}/module`, validationMiddleware(UpdateModuleDto, 'body'), this.rolesController.updateModuleToRoles);
    this.router.patch(`${this.path}/module`, validationMiddleware(ToggleModuleOfRoleDto, 'body'), this.rolesController.toggleModuleOfRoles);
    this.router.delete(`${this.path}/module`, validationMiddleware(DeleteModuleDto, 'body'), this.rolesController.deleteModuleOfRoles);

    // Actions
    this.router.post(`${this.path}/module-action`, validationMiddleware(CreateActionDto, 'body'), this.rolesController.addActionToModule);
    this.router.put(`${this.path}/module-action`, validationMiddleware(UpdateActionOfModuleDto, 'body'), this.rolesController.updateActionOfModules);
    this.router.patch(`${this.path}/module-action`, validationMiddleware(ToggleActionOfModuleOfRoleDto, 'body'), this.rolesController.toggleActionOfModuleOfRole);
    this.router.delete(`${this.path}/module-action`, validationMiddleware(DeleteActionOfModuleDto, 'body'), this.rolesController.deleteActionOfModuleOfRole);
  }
}

export default RolesRoute;
