import { OrgType } from "@/interfaces/orgs.interface";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments  } from "class-validator";

@ValidatorConstraint({name: 'IsOrgType', async: false})
export class IsOrgType implements ValidatorConstraintInterface {
    validate(orgtype: OrgType, args: ValidationArguments) {
        return orgtype === OrgType.merchant || orgtype === OrgType.none
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "($value) Org type is in correct"
    }
}