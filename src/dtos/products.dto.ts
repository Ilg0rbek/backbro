import { IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    public name_uz: string

    @IsString()
    public name_ru: string

    public characteristics: any[]

    public description_uz: string

    public description_ru: string

    @IsString()
    public main_photo: string

    public categories: string[]

    @IsString()
    public brand: string
}



export class EditProductDto {
    @IsString()
    public _id: string

    @IsString()
    public name_uz: string

    @IsString()
    public name_ru: string

    public characteristics: any[]

    public description_uz: string

    public description_ru: string

    @IsString()
    public main_photo: string

    public categories: string[]

    @IsString()
    public brand: string
}

