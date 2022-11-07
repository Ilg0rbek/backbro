import { Request } from 'express';
import {IUser as User } from '@interfaces/users.interface';
import { IRole } from './role.interface';

export interface DataStoredInToken {
  _id: string;
  actions: string[];
  modules: string[];
  staff: string[];
  role: IRole
}

export interface FoundUser {
  password: string;
  username: string;
  _id: string;
  actions: string[];
  modules: string[];
  staff: string[];
  role: IRole
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
