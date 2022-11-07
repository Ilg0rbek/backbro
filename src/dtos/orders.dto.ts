import { StockItem } from '@/interfaces/stock.interface';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
   @IsString()
   public order_title: string

   @IsString()
   public customer: string

   public stock_items: any

   @IsString()
   public paymentMethod: string
   
   // @IsNumber()
   // public quantity: number

   @IsString()
   public delivery_date: string

   public statuses: any // for now
}