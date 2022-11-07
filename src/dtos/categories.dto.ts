import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  public name_uz: string;
  
  @IsString()
  public name_en: string;
  
  @IsString()
  public name_ru: string;

  @IsString()
  public parent: string

  @IsString() 
  public category: string
}


export class UpdateCategoryDto {

  @IsString()
  public _id: string
  
  @IsString()
  public name_uz: string;
  
  @IsString()
  public name_en: string;
  
  @IsString()
  public name_ru: string;

}


export class DeleteCategoryDto {

  @IsString()
  public category: string

}