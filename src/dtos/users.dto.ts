import { IRole } from '@/interfaces/role.interface';
import { IStaff } from '@/interfaces/staff.interface';
import { IUser } from '@/interfaces/users.interface';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsString()
  public staff: IStaff['_id']

  @IsString()
  public role: IRole['_id']
}

export class LoginUserDataDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}


export class UpdateUserDto {
  
  @IsString()
  public _id: IUser['_id']

  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsString()
  public staff: IStaff['_id']

  @IsString()
  public role: IRole['_id']
}
