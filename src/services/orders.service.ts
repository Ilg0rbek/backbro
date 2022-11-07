import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { IOrder, Statuses } from '@/interfaces/order.iterface';
import orderModel from '@/models/orders.model';
import { CreateOrderDto } from '@/dtos/orders.dto';
import customerModel from '@/models/customers.model';
import StockItemModel from '@/models/stock.model';
import { StockItem } from '@/interfaces/stock.interface';
import { Types } from 'mongoose';

// var token = "5597703346:AAGIAm170bSS8dw0Z0TrNcENLbcycKPqP0k";
// const TelegramBot = require("node-telegram-bot-api");
// const bot = new TelegramBot(token, { polling: true });

export interface IStatusesCount { 
    all: number;
    new: number; 
    confirmed: number; 
    packaging: number; 
    ready: number; 
    delivering: number; 
    done: number; 
    cancelled: number;
    archived: number;
}

class OrderService {
    public orders = orderModel
    public customers = customerModel
    public stockItems = StockItemModel

    public async updateOrders(orders: IOrder[]): Promise<any> {

        for(let i = 0; i < orders.length; i++) {
            orders[i].statuses.push({
                value: Statuses.packaging,
                comment: '',
                changed_date: new Date()
            })
            await this.orders.findByIdAndUpdate( new Types.ObjectId(orders[i]._id), {
                $set: {
                    ...orders[i]
                }
            })
        }
        return 'Updated'
    }


    public async setStartCollecting({ _ids, state }): Promise<any> {
        console.log("state", state)
        const updatedData = await this.orders.updateMany({
            _id: {
                $in: _ids.map((id: string) => new Types.ObjectId(id))
            }
        },  {
            $set: {
                started_collecting: state
            }
        }).exec()
        return updatedData
    }


    public async setStatus(statusBody: any): Promise<IOrder> {
        const updatedOrder = await this.orders.findByIdAndUpdate(statusBody._id, {
            $push: {
                statuses: {
                    value: statusBody.status,
                    comment: statusBody.comment
                }
            }
        }).exec()
        return updatedOrder
    }

    public async statusesCount(): Promise<IStatusesCount> {
        let counts = await this.orders.aggregate([
            {
                $set: {
                    last_st: {
                        $last: "$statuses.value"
                    }
                }
            },
            {
                $group: {
                    _id: "$last_st",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        counts = counts.map((itm: any) => {
            return {
                [itm._id + '']: itm.count
            }
        })

        const archived = await this.orders.countDocuments({archived: true})

        let counts_obj : IStatusesCount = {
            all: 0,
            new: 0,
            confirmed: 0,
            packaging: 0,
            ready: 0,
            delivering: 0,
            done: 0,
            cancelled: 0,
            archived: archived
        }

        counts_obj = {
            ...counts_obj,
            ...counts.reduce((accumulator, value) => {
                return {...accumulator, [Object.keys(value)[0]]: Object.values(value)[0]};
              }, {}),
        }
        
        return counts_obj
    }

    public async findAllOrdersCollectingStarted(): Promise<IOrder[]> {
        const _orders: IOrder[] = await this.orders.aggregate([
            {
                $set: {
                    last_st: {
                        $last: "$statuses.value"
                    }
                }
            },
            {
                $match: {
                    last_st: 'confirmed',
                    started_collecting: true
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            }, {
                $unwind: {
                    path: '$stock_items'
                }
            }, {
                $lookup: {
                    from: 'stockitems',
                    localField: 'stock_items.item',
                    foreignField: '_id',
                    as: 'stock_items.item',
                    pipeline: [{
                        $lookup: {
                            from: 'orgs',
                            localField: 'merchant',
                            foreignField: '_id',
                            as: 'merchant',
                        }
                    }, {
                        $unwind: {
                            path: '$merchant'
                        }
                    }]
                }
            }, {
                $unwind: {
                    path: '$stock_items.item'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    stock_items: {
                        $push: '$stock_items'
                    },
                    order_title: {
                        $first: '$order_title'
                    },
                    customer: {
                        $first: '$customer'
                    },
                    delivery_date: {
                        $first: '$delivery_date'
                    },
                    delivered_date: {
                        $first: '$delivered_date'
                    },
                    payment_method: {
                        $first: '$payment_method'
                    },
                    paid_date: {
                        $first: '$paid_date'
                    },
                    is_paid: {
                        $first: '$is_paid'
                    },
                    statuses: {
                        $first: '$statuses'
                    },
                    createdAt: {
                        $first: '$createdAt'
                    },
                    updatedAt: {
                        $first: '$updatedAt'
                    }
                }
            },
            {
                $unwind: {
                    path: "$customer"
                }
            }
        ]).exec();
        return _orders;
    }

    public async findAllOrders(params: any): Promise<IOrder[]> {
        let ppline = []
        if (params.table_type === 'allorders') {
            ppline = [

                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customer',
                        foreignField: '_id',
                        as: 'customer'
                    }
                }, {
                    $unwind: {
                        path: '$stock_items'
                    }
                }, {
                    $lookup: {
                        from: 'stockitems',
                        localField: 'stock_items.item',
                        foreignField: '_id',
                        as: 'stock_items.item',
                        pipeline: [{
                            $lookup: {
                                from: 'orgs',
                                localField: 'merchant',
                                foreignField: '_id',
                                as: 'merchant',
                            }
                        }, {
                            $unwind: {
                                path: '$merchant'
                            }
                        }]
                    }
                }, {
                    $unwind: {
                        path: '$stock_items.item'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        stock_items: {
                            $push: '$stock_items'
                        },
                        order_title: {
                            $first: '$order_title'
                        },
                        customer: {
                            $first: '$customer'
                        },
                        delivery_date: {
                            $first: '$delivery_date'
                        },
                        delivered_date: {
                            $first: '$delivered_date'
                        },
                        payment_method: {
                            $first: '$payment_method'
                        },
                        paid_date: {
                            $first: '$paid_date'
                        },
                        is_paid: {
                            $first: '$is_paid'
                        },
                        statuses: {
                            $first: '$statuses'
                        },
                        createdAt: {
                            $first: '$createdAt'
                        },
                        updatedAt: {
                            $first: '$updatedAt'
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$customer"
                    }
                },
            ]
        } else {
            ppline = [
                {
                    $set: {
                        last_st: {
                            $last: "$statuses.value"
                        }
                    }
                },
                {
                    $match: {
                        last_st: params.table_type
                    }
                },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customer',
                        foreignField: '_id',
                        as: 'customer'
                    }
                }, {
                    $unwind: {
                        path: '$stock_items'
                    }
                }, {
                    $lookup: {
                        from: 'stockitems',
                        localField: 'stock_items.item',
                        foreignField: '_id',
                        as: 'stock_items.item',
                        pipeline: [{
                            $lookup: {
                                from: 'orgs',
                                localField: 'merchant',
                                foreignField: '_id',
                                as: 'merchant',
                            }
                        }, {
                            $unwind: {
                                path: '$merchant'
                            }
                        }]
                    }
                }, {
                    $unwind: {
                        path: '$stock_items.item'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        stock_items: {
                            $push: '$stock_items'
                        },
                        order_title: {
                            $first: '$order_title'
                        },
                        customer: {
                            $first: '$customer'
                        },
                        delivery_date: {
                            $first: '$delivery_date'
                        },
                        delivered_date: {
                            $first: '$delivered_date'
                        },
                        payment_method: {
                            $first: '$payment_method'
                        },
                        paid_date: {
                            $first: '$paid_date'
                        },
                        is_paid: {
                            $first: '$is_paid'
                        },
                        statuses: {
                            $first: '$statuses'
                        },
                        createdAt: {
                            $first: '$createdAt'
                        },
                        updatedAt: {
                            $first: '$updatedAt'
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$customer"
                    }
                }
            ]
        }
        const _orders: IOrder[] = await this.orders.aggregate(ppline).exec();
        return _orders;
    }

    public async createOrder(orderData: CreateOrderDto): Promise<IOrder> {
        if (isEmpty(orderData)) throw new HttpException(400, "You're not order data");
        console.log("asdsd order", orderData)
        for (let i = 0; i < orderData.stock_items.length; i++) {
            await this.stockItems.findByIdAndUpdate(orderData.stock_items[i].item, {
                $inc: {
                    quantity: (-1) * orderData.stock_items[i].quantity
                }
            })
        }
        const lastNum = await this.orders.countDocuments().exec()
        const createOrderData: IOrder = await this.orders.create({
            order_number: lastNum + 1,
            ...orderData
        });
        // bot.on("message", ({text}) => {
        const customer = await this.customers.findById(orderData.customer).exec()
        const stockItems = await this.stockItems.find({
            _id: {
                $in: orderData.stock_items.map((st_item: { item: string; quantity: number }) => st_item.item)
            }
        }).exec()


        const ordersCount = await this.orders.countDocuments().exec()
//         bot.sendMessage(
//             -1001760189777,
//             `<i>Order №</i>: <b>${ordersCount}</b>
// <i>Address</i>:  <b>${customer.address}</b>
// <i>Phone ☎️</i>:  <b>${customer.phone_nums.join(',')}</b>
// <i>Product</i>:  <b>${stockItems.map((st_item: StockItem) => {
//                 const quantity = orderData.stock_items.find((itm) => itm.item.includes(st_item._id))
//                 return st_item.product_ru + (quantity ? quantity.quantity > 1 ? `(${quantity.quantity})` : '' : '')
//             }).join(' / ')}</b>
// <i>Cost $</i>:  <b>${stockItems.map((st_item: StockItem) => {
//                 const quantity = orderData.stock_items.find((itm) => itm.item.includes(st_item._id))
//                 return st_item.price * (quantity ? quantity.quantity : 1)
//             }).join(' + ')}</b>
// <i>Driver</i>:  <b>@kuryer</b>
// <i>Date</i>:  <b>${(new Date(createOrderData.delivery_date)).toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent' })} ${(new Date(createOrderData.delivery_date)).toLocaleTimeString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</b>
// <i>Cust. account</i>:  <b>${customer.contacts.join(',')}</b>
// <i>State</i>:   <b>#new</b>
// <i>Location</i>:  <b>https://yandex\.ru/maps/?pt=${customer.location.coords[1]},${customer.location.coords[0]}&z=${customer.location.zoom}&l=map </b>
// `,
//             { parse_mode: 'HTML' }
//         );
       
        return createOrderData;
    }

    public async deleteOrder(orderData: { _id: string }): Promise<IOrder> {
        if (isEmpty(orderData)) throw new HttpException(400, "You're not order data");
        const createOrderData: IOrder = await this.orders.findByIdAndDelete(orderData);
        return createOrderData;
    }

}

export default OrderService;
