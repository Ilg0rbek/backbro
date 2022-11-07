import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import orgModel from '@/models/org.model';
import { IOrg } from '@/interfaces/orgs.interface';
import { CreateOrgDto, UpdateOrgDto } from '@/dtos/orgs.dto';


class OrgService {
    public orgs = orgModel


    public async searchMerchant(search_text: string | null): Promise<IOrg[]> {
        const merchats = await this.orgs.aggregate([{
            $match: {
                org_type: 'merchant'
            }
        },  {
            $match: {
                name: { $regex: search_text, $options: "i" }
            }
        }]).exec()
        return merchats
    }
    
    public async findAllOrgs(params: any): Promise<IOrg[]> {
        if(params.org_type) {
            const _orgs: IOrg[] = await this.orgs.find({org_type: params.org_type});
            return _orgs;
        } 
        const _orgs: IOrg[] = await this.orgs.find();
        return _orgs;
    }
   
    public async createOrg(orgData: CreateOrgDto): Promise<IOrg> {
        if (isEmpty(orgData)) throw new HttpException(400, "You're not roleData");
        const createOrgData: IOrg = await this.orgs.create(orgData);
        return createOrgData;
    }
    
    public async updateOrg(orgData: UpdateOrgDto): Promise<IOrg> {
        if (isEmpty(orgData)) throw new HttpException(400, "You're not roleData");

        const updatedOrgData: IOrg = await this.orgs.findByIdAndUpdate(orgData._id, {
            $set: {
                org_type: orgData.org_type,
                name: orgData.name,
                contacts: orgData.contacts
            }
        });
        
        for(let i = 0; i < orgData.branches.length; i++) {
            if(orgData.branches[i].is_new ) {
                await this.orgs.findByIdAndUpdate(orgData._id, {
                    $push: {
                        branches: {
                            name: orgData.branches[i].name,
                            location: orgData.branches[i].location,
                            contacts: orgData.branches[i].contacts,
                            is_main: orgData.branches[i].is_main
                        }
                    }
                });
            } else if(orgData.branches[i].is_for_delete) {
                await this.orgs.updateOne({
                    "branches._id": orgData.branches[i]._id
                }, {
                    $pull: {
                        branches: {
                            _id: orgData.branches[i]._id
                        }
                    }
                });
            } else {
                await this.orgs.updateOne({
                    "branches._id": orgData.branches[i]._id
                }, {
                    $set: {
                        'branches.$.contacts': orgData.branches[i].contacts,
                        'branches.$.location': orgData.branches[i].location,
                        'branches.$.name': orgData.branches[i].name,

                     }
                });
            }
        }

        return updatedOrgData;
    }
}

export default OrgService;
