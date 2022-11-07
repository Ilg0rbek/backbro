import { IBranch } from '@/interfaces/orgs.interface';
import { IStaff } from '@/interfaces/staff.interface';
import { IsString, IsArray } from 'class-validator';


export class CreateStaffDto {
    @IsString()
    public first_name: string

    @IsString()
    public last_name: string

    @IsArray()
    @IsString({each: true})
    public contacts: string

    @IsString()
    public org: IBranch['_id']
}

export class UpdateStaffDto {
    @IsString()
    public _id: IStaff['_id']

    @IsString()
    public first_name: string

    @IsString()
    public last_name: string

    @IsArray()
    @IsString({each: true})
    public contacts: string

    @IsString()
    public org: IBranch['_id']
}

