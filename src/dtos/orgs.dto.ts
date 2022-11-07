import { IBranch, OrgType } from '@/interfaces/orgs.interface';
import { IsString, IsArray, Validate } from 'class-validator';
import { Document } from 'mongoose';
import { IsOrgType } from './IsMerchant';

export class CreateOrgDto {
    @Validate(IsOrgType)
    public org_type: OrgType

    @IsString()
    public name: string

    @IsArray()
    @IsString({each: true})
    public contacts: string[]

    @IsArray()
    public branches: IBranch[]
}

export class UpdateOrgDto {
    @IsString()
    public _id: string

    @Validate(IsOrgType)
    public org_type: OrgType

    @IsString()
    public name: string

    @IsArray()
    @IsString({each: true})
    public contacts: string[]

    @IsArray()
    public branches: IBranch[]
}


