import { model, Schema, Document } from 'mongoose';
import { IOrg, OrgType } from '@/interfaces/orgs.interface';



const orgSchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    org_type: {
        type: String,
        enum: OrgType,
        required: true
    },
    contacts: [String],
    branches: {
        type: [{
            name: {
                type: String,
                unique: true, 
                required: true
            },
            is_main: Boolean,
            location: {
                zoom: Number,
                coords: [Number]
            },
            contacts: [String]
        }]
    }
}, {
    timestamps: true
});

const orgModel = model<IOrg & Document>('Org', orgSchema);

export default orgModel;
