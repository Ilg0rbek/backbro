import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDataDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, FoundUser, TokenData } from '@interfaces/auth.interface';
import { IUser as User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ username: userData.username });
    if (findUser) throw new HttpException(409, `You're username ${userData.username} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: LoginUserDataDto): Promise<{ cookie: string; findUser: FoundUser }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const findUser: FoundUser[] = await this.users.aggregate([{
      $match: {
        is_delete: false,
        username: userData.username
      }
  },  {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'role'
      }
  },   {
      $unwind: {
        path: '$role',
      }
  }, {
      $project: {
        role: {
          "title_uz": "$role.title_uz",
          "title_ru": "$role.title_ru",
          "title_en": "$role.title_en",
          "_id": "$role._id"
        },
        modules: "$role.modules",
        staff: "$staff",
        password: "$password",
        username: "$username"
      }
  },  {
     
      $set: {
        modules: {
          $filter: {
              input: "$modules",
              as: "module",
              cond: {
                  $eq: [true, "$$module.permission"]
              }
          }
        }
      }
  }, {
      $unwind: {
        path: '$modules',
      }
  }, {
      $group: {
        _id: '$_id',
  
        role: {
          $first: '$role'
        },
         staff: {
          $first: "$staff"
         },
        password: {
          $first: "$password"
        },
        username: {
          $first: "$username"
        },
        modules: {
          $push: '$modules.uri'
        },
        actions: {
          $push: "$modules.actions"
        }
      }
  },  {
      $set: {
        actions: {
          $reduce: {
            input: "$actions",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        }
      }
  },
  {
      
      $set: {
        actions: {
          $filter: {
              input: "$actions",
              as: "action",
              cond: {
                  $eq: [true, "$$action.permission"]
              }
          }
        }
      }
  }, {
    $set: {
      "actions":  {
        $map: {
          input: "$actions",
          as: "act",
          in: "$$act.uri"
        }
      }
    }
  }
  ])
  console.log("userData.password, findUser[0].password", userData.password, findUser)

    if (!findUser && findUser.length === 0) throw new HttpException(409, `You're username ${userData.username} not found`);
    console.log("userData.password, findUser[0].password", userData.password, findUser[0].password)
    const isPasswordMatching: boolean = await compare(userData.password, findUser[0].password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser[0]);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser : findUser[0] };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ username: userData.username, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.username} not found`);

    return findUser;
  }

  public createToken(user: FoundUser): TokenData {
    delete user.password
    const dataStoredInToken: DataStoredInToken = user
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
