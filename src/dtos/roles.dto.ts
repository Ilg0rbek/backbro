import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  public title_uz: string;
  
  @IsString()
  public title_en: string;
  
  @IsString()
  public title_ru: string;
}


export class UpdateRoleDto {
    @IsString()
    public _id: string;

    @IsString()
    public title_uz: string;
    
    @IsString()
    public title_en: string;
    
    @IsString()
    public title_ru: string;
}

export class DeleteRoleDto {
  @IsString()
  public _id: string;
}


export class CreateModuleDto {
    @IsString()
    public uri: string;
}

export class UpdateModuleDto {
  @IsString()
  public uri: string;

  @IsString()
  public new_uri: string;
}

export class DeleteModuleDto {
  @IsString()
  public uri: string
}

export class ToggleModuleOfRoleDto {
  @IsString()
  public role_id: string;

  @IsString()
  public module_id: string;
}


export class CreateActionDto {
  
  @IsString()
  public uri: string

  @IsString()
  public module_uri: string

}

export class UpdateActionOfModuleDto {
  @IsString()
  public module_uri: string;

  @IsString()
  public uri: string;

  @IsString()
  public new_uri: string;
}

export class DeleteActionOfModuleDto {
  @IsString()
  public module_uri: string;

  @IsString()
  public uri: string;
}

export class ToggleActionOfModuleOfRoleDto {
  @IsString()
  public role_id: string;

  @IsString()
  public module_id: string;

  @IsString()
  public action_id: string;
}
