import { model, Schema, Document } from 'mongoose';
import { IRole } from '@/interfaces/role.interface';

const roleSchema: Schema = new Schema({
    title_uz: {
        type: String,
        unique: true
    },
    title_ru: {
        type: String,
        unique: true
    },
    title_en: {
        type: String,
        unique: true
    },
    modules: {
        type: [{
            uri: String,
            permission: {
                type: Boolean, 
                default: false
            },
            actions: {
                type: [{
                    uri: String,
                    permission: {
                        type: Boolean,
                        default: false
                    }
                }],
                default: []
            }
        }],
        default: []
    }
}, {
    timestamps: true
});

const roleModel = model<IRole & Document>('Role', roleSchema);

export default roleModel;
