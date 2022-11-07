import { HttpException } from '@exceptions/HttpException';
import { IModule, IRole } from '@interfaces/role.interface'
import roleModel from '@models/roles.model'
import { isEmpty } from '@utils/util';
import { CreateActionDto, CreateModuleDto, CreateRoleDto, DeleteActionOfModuleDto, DeleteModuleDto, DeleteRoleDto, ToggleActionOfModuleOfRoleDto, ToggleModuleOfRoleDto, UpdateActionOfModuleDto, UpdateModuleDto, UpdateRoleDto } from '@/dtos/roles.dto';
import { Document, Types, UpdateWriteOpResult } from 'mongoose';


class RoleService {
    public roles = roleModel

    public async findAllRole(): Promise<IRole[]> {
        const roles: IRole[] = await this.roles.find();
        return roles;
    }

    public async createRole(roleData: CreateRoleDto): Promise<IRole> {
        // Here I will create new role from copy of already exsiting one, and with permssions made false
        if (isEmpty(roleData)) throw new HttpException(400, "You're not roleData");
        let roleCopy = await this.roles.findOne().exec() as any
        // console.log(roleCopy)
        if (roleCopy) { // if there is roleCopy found any ?
            console.log("in")
            roleCopy.modules = roleCopy.modules.map(md => {
                let actions = md.actions.map(ac => {
                    return {
                        permission: false,
                        uri: ac.uri
                    }
                })
                return {
                    uri: md.uri,
                    permission: false,
                    actions
                }
            })
            delete roleCopy._id
            roleCopy.title_uz = roleData.title_uz
            roleCopy.title_ru = roleData.title_ru
            roleCopy.title_en = roleData.title_en
        }

        if(roleCopy) {
            console.log("roleCopy", roleCopy)
            const createUserData: IRole = await this.roles.create({
                title_en: roleCopy.title_en,
                title_ru: roleCopy.title_ru,
                title_uz: roleCopy.title_uz,
                modules: roleCopy.modules
            });
            return createUserData;
        } else {
            const createUserData: IRole = await this.roles.create(roleData);
            return createUserData;
        }
    }

    public async updateRole(roleData: UpdateRoleDto): Promise<IRole> {
        const updatedRole: IRole = await this.roles.findByIdAndUpdate(roleData._id, {
            $set: {
                title_ru: roleData.title_ru,
                title_en: roleData.title_en,
                title_uz: roleData.title_uz,
            }
        }).exec()
        return updatedRole
    }

    public async deleteRole(roleData: DeleteRoleDto): Promise<IRole> {
        const updatedRole: IRole = await this.roles.findByIdAndDelete(roleData._id).exec()
        return updatedRole
    }

    public async addModuleToRoles(moduleData: CreateModuleDto): Promise<UpdateWriteOpResult> {
        const createdModuleResult = await this.roles.updateMany({}, {
            $push: {
                modules: moduleData
            }
        }).exec()

        return createdModuleResult
    }


    public async UpdateModuleOfRoles(moduleData: UpdateModuleDto): Promise<UpdateWriteOpResult> {
        const createdModuleResult = await this.roles.updateMany({
            "modules.uri": moduleData.uri
        }, {
            $set: {
                "modules.$.uri": moduleData.new_uri
            }
        }).exec()

        return createdModuleResult
    }

    public async deleteModuleOfRoles(moduleData: DeleteModuleDto): Promise<UpdateWriteOpResult> {
        const createdModuleResult = await this.roles.updateMany({}, {
            $pull: {
                "modules": {
                    "uri": moduleData.uri
                }
            }
        }).exec()
        return createdModuleResult
    }

    public async toggleModuleOfRole(moduleData: ToggleModuleOfRoleDto): Promise<UpdateWriteOpResult> {

        const permission = await this.roles.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(moduleData.role_id)
                }
            },
            {
                $unwind: {
                    path: "$modules"
                }
            }, {
                $match: {
                    "modules._id": new Types.ObjectId(moduleData.module_id)
                }
            }, {
                $project: {
                    permission: "$modules.permission"
                }
            }
        ])
        const toggleModuleResult = await this.roles.updateOne({
            "modules._id": new Types.ObjectId(moduleData.module_id),
            "_id": new Types.ObjectId(moduleData.role_id)
        }, {
            $set: {
                "modules.$.permission": permission.length > 0 ? !permission[0].permission : false
            }
        }).exec()
        return toggleModuleResult
    }


    public async addActionToModule(actionData: CreateActionDto): Promise<UpdateWriteOpResult> {
        const createdActionResult = await this.roles.updateMany({
            'modules.uri': actionData.module_uri
        }, {
            $push: {
                'modules.$.actions': {
                    uri: actionData.uri
                } // action uri
            }
        }).exec()

        return createdActionResult
    }

    public async updateActionOfModules(actionData: UpdateActionOfModuleDto): Promise<UpdateWriteOpResult> {
        const updatedActionResult = await this.roles.updateMany({
            "modules.uri": actionData.module_uri
        }, {
            $set: {
                "modules.$.actions.$[act].uri": actionData.new_uri
            }
        }, {
            arrayFilters: [{ "act.uri": actionData.uri }]
        }).exec()

        return updatedActionResult
    }

    public async deleteActionOfModules(actionData: DeleteActionOfModuleDto): Promise<UpdateWriteOpResult> {
        const updatedActionResult = await this.roles.updateMany({
            "modules.uri": actionData.module_uri
        }, {
            $pull: {
                "modules.0.actions": {
                    "uri": actionData.uri
                }
            }
        }).exec()

        return updatedActionResult
    }


    public async toggleActionOfModuleOfRole(actionData: ToggleActionOfModuleOfRoleDto): Promise<UpdateWriteOpResult> {
        const permission = await this.roles.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(actionData.role_id)
                }
            },
            {
                $unwind: {
                    path: "$modules"
                }
            }, {
                $match: {
                    "modules._id": new Types.ObjectId(actionData.module_id)
                }
            }, {
                $project: {
                    "actions": "$modules.actions"
                }
            },
            {
                $unwind: {
                    path: "$actions"
                }
            }, {
                $match: {
                    "actions._id": new Types.ObjectId(actionData.action_id)
                }
            },
            {
                $project: {
                    permission: "$actions.permission"
                }
            }
        ])
        const toggleActionOfModuleResult = await this.roles.updateOne({
            "_id": new Types.ObjectId(actionData.role_id),
            modules: {
                $elemMatch: {
                    "_id": new Types.ObjectId(actionData.module_id),
                    "actions._id": new Types.ObjectId(actionData.action_id)
                }
            }
        }, {
            $set: {
                "modules.$.actions.$[act].permission": permission.length > 0 ? !permission[0].permission : false
            }
        }, {
            arrayFilters: [{ "act._id": actionData.action_id }]
        }).exec()
        return toggleActionOfModuleResult
    }

}

export default RoleService;
