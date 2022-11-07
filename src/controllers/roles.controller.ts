import { NextFunction, Request, Response } from 'express';

import roleService from '@/services/roles.service'
import { IRole } from '@/interfaces/role.interface';
import { CreateActionDto, CreateModuleDto, CreateRoleDto, DeleteActionOfModuleDto, DeleteModuleDto, DeleteRoleDto, ToggleActionOfModuleOfRoleDto, ToggleModuleOfRoleDto, UpdateActionOfModuleDto, UpdateModuleDto, UpdateRoleDto } from '@/dtos/roles.dto';

class RolesController {
  public roleService = new roleService();
  public getRoles = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const allRoles: IRole[] = await this.roleService.findAllRole()
      res.status(200).json({ data: allRoles, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: CreateRoleDto = req.body
      const createRoleData: IRole = await this.roleService.createRole(roleData)
      res.status(201).json({ data: createRoleData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: UpdateRoleDto = req.body
      const updateRoleData: IRole = await this.roleService.updateRole(roleData)
      res.status(201).json({ data: updateRoleData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: DeleteRoleDto = req.body
      const updateRoleData: IRole = await this.roleService.deleteRole(roleData)
      res.status(201).json({ data: updateRoleData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public addModuleToRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moduleData: CreateModuleDto = req.body
      const createRoleModule = await this.roleService.addModuleToRoles(moduleData)
      res.status(201).json({ data: createRoleModule, message: 'created' })
    } catch (error) {
      next(error)
    }
  }


  public updateModuleToRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moduleData: UpdateModuleDto = req.body
      const updatedModuleData = await this.roleService.UpdateModuleOfRoles(moduleData)
      res.status(201).json({ data: updatedModuleData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }


  public deleteModuleOfRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moduleData: DeleteModuleDto = req.body
      const updatedModuleData = await this.roleService.deleteModuleOfRoles(moduleData)
      res.status(201).json({ data: updatedModuleData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public toggleModuleOfRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moduleData: ToggleModuleOfRoleDto = req.body
      const updatedModuleData = await this.roleService.toggleModuleOfRole(moduleData)
      res.status(201).json({ data: updatedModuleData, message: 'toggled' })
    } catch (error) {
      next(error)
    }
  }


  public addActionToModule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actionData: CreateActionDto = req.body
      const createModuleAction = await this.roleService.addActionToModule(actionData)
      res.status(201).json({ data: createModuleAction, message: 'created' })
    } catch (error) {
      next(error)
    }
  }


  public updateActionOfModules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actionData: UpdateActionOfModuleDto = req.body
      const createModuleAction = await this.roleService.updateActionOfModules(actionData)
      res.status(201).json({ data: createModuleAction, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public toggleActionOfModuleOfRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actionData: ToggleActionOfModuleOfRoleDto = req.body
      const createModuleAction = await this.roleService.toggleActionOfModuleOfRole(actionData)
      res.status(201).json({ data: createModuleAction, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteActionOfModuleOfRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actionData: DeleteActionOfModuleDto = req.body
      const createModuleAction = await this.roleService.deleteActionOfModules(actionData)
      res.status(201).json({ data: createModuleAction, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default RolesController;
