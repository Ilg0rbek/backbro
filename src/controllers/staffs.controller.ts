import { NextFunction, Request, Response } from 'express';

import { IOrg } from '@/interfaces/orgs.interface';
import { CreateOrgDto, UpdateOrgDto } from '@/dtos/orgs.dto';
import StaffService from '@/services/staffs.service';
import { IStaff } from '@/interfaces/staff.interface';
import { CreateStaffDto, UpdateStaffDto } from '@/dtos/staffs.dto';

class StaffsController {
  public staffService = new StaffService()
  public getStaffs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allOrgs: IStaff[] = await this.staffService.findAllStaffs()
      res.status(200).json({ data: allOrgs, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgData: CreateStaffDto = req.body
      const createStaffData: IStaff = await this.staffService.createStaff(orgData)
      res.status(201).json({ data: createStaffData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staffData: UpdateStaffDto = req.body
      const updateStaffData: IStaff = await this.staffService.updateStaff(staffData)
      res.status(201).json({ data: updateStaffData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }
}

export default StaffsController;
