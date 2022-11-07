import { IOrg } from '@/interfaces/orgs.interface';
import { Product } from '@/interfaces/product.interface';
import { IsNumber, IsString } from 'class-validator';

export class CreateStockItemDto {

    public characteristics: any[]

    @IsString()
    public product_uz: string

    @IsString()
    public product_ru: string

    @IsString()
    public slug_ru: string

    @IsString()
    public slug_uz: string

    @IsString()
    public product_id: Product['_id']

    @IsNumber()
    public quantity: number

    @IsNumber()
    public price: number

    @IsNumber()
    public discount: number 

    @IsString()
    public merchant: IOrg['_id']

    @IsString()
    public additional_description_uz: string

    @IsString()
    public additional_description_ru: string

}