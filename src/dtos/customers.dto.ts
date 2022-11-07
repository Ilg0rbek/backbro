import { IsArray, IsString } from 'class-validator';

export class CreateCustomerDto {
   
   
    @IsString()
    public address: string

    public customer_tags: string[]

    public phone_nums: string[]
    
    public location: {
        zoom: number
        coords: number[]
    }


    @IsString()
    public first_name: string

    @IsString()
    public last_name: string

    @IsArray()
    public contacts: string[]

}