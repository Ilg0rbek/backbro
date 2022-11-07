import { NextFunction, Request, Response } from 'express';

import OrgService from '@/services/orgs.service';
import { IOrg } from '@/interfaces/orgs.interface';
import { CreateOrgDto, UpdateOrgDto } from '@/dtos/orgs.dto';

class OrgsController {
  public orgService = new OrgService()
  public getOrgs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {org_type} = req.query
      const allOrgs: IOrg[] = await this.orgService.findAllOrgs({org_type})
      res.status(200).json({ data: allOrgs, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgData: CreateOrgDto = req.body
      const createOrgData: IOrg = await this.orgService.createOrg(orgData)
      res.status(201).json({ data: createOrgData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgData: UpdateOrgDto = req.body
      const updateOrgData: IOrg = await this.orgService.updateOrg(orgData)
      res.status(201).json({ data: updateOrgData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }
}

export default OrgsController;
