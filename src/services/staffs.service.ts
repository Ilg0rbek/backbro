import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import staffModel from '@/models/staffs.model';
import { IStaff } from '@/interfaces/staff.interface';
import { UpdateStaffDto, CreateStaffDto } from '@/dtos/staffs.dto';
import orgModel from '@/models/org.model';
import { Schema } from 'mongoose';


class StaffService {
    public staffs = staffModel
    public orgs = orgModel

    public async findAllStaffs(): Promise<IStaff[]> {
        const _staffs: IStaff[] = await this.staffs.aggregate([
            {
                $set: {
                    org_temp: "$org"
                }
            },
            {
                $lookup: {
                  from: 'orgs',
                  localField: 'org',
                  foreignField: 'branches._id',
                  as: 'org'
                }
            },
            {
                $unwind: {
                  path: '$org'
                }
            },
            {
                $set: {
                    'org.branches': {
                        $filter: {
                            input: '$org.branches',
                            as: 'branch',
                            cond: {
                                $eq: ['$$branch._id', '$org_temp']
                            }
                        }
                    }
                }
            }
        ])
        // for(let i = 0; i < _staffs.length; i++) {
        //     // console.log(await this.orgs.find({'branches._id': '62ed076cf27eb294443fd5e2'}).exec())
        //     _staffs[i].org = await this.orgs.findOne({'branches._id': '62ed076cf27eb294443fd5e2'}).exec();

        // }
        return _staffs;
    }
   
    public async createStaff(staffData: CreateStaffDto): Promise<IStaff> {
        if (isEmpty(staffData)) throw new HttpException(400, "You're not staffData");
        const createStaffData: IStaff = await this.staffs.create(staffData);
        return createStaffData;
    }
    
    public async updateStaff(staffData: UpdateStaffDto): Promise<IStaff> {
        if (isEmpty(staffData)) throw new HttpException(400, "You're not staffData");

        const updatedStaffData: IStaff = await this.staffs.findByIdAndUpdate(staffData._id, {
            $set: {
                ...staffData
            }
        });
        return updatedStaffData;
    }
}

export default StaffService;
