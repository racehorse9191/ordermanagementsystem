import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'jhi-chef-orderlist',
  templateUrl: './shef-orderlist.component.html',
  styleUrls: ['./shef-orderlist.component.scss'],
})
export class ShefOrderlist {
  completedOrders = [];
  orders = [
    {
      id: 12,
      menuIdsandQty: [
        {
          id: 11,
          name: 'Chicken Manchurian',
          dishQty: 'half',
          orderQty: 2,
          price: '89',
          allDishQty: [{ id: 12, qtyName: 'full', orderQty: 2 }],
          orderTotal: 178,
        },
        {
          id: 11,
          name: 'Vada pav',
          dishQty: 'full',
          orderQty: 2,
          price: '89',
          allDishQty: [{ id: 12, qtyName: 'full', orderQty: 2 }],
          orderTotal: 178,
        },
        {
          id: 11,
          name: 'Masala dosa',
          dishQty: 'qtr',
          orderQty: 2,
          price: '89',
          allDishQty: [{ id: 12, qtyName: 'full', orderQty: 2 }],
          orderTotal: 178,
        },
      ],
      waiterName: 'rohan',
      note: 'less spicy',
      orderDate: '2021-02-16',
      orderstatus: null,
      menu: null,
      tables: {
        id: 2,
        tableName: 'T2',
        tablestatus: 'ENGAGED',
      },
    },
    {
      id: 13,
      menuIdsandQty: [
        {
          id: 11,
          name: 'Chicken Manchurian',
          dishQty: 'full',
          orderQty: 2,
          price: '89',
          allDishQty: [{ id: 12, qtyName: 'full', orderQty: 2 }],
          orderTotal: 178,
        },
      ],
      waiterName: 'paul',
      note: 'testing for table status',
      orderDate: '2021-02-16',
      orderstatus: null,
      menu: null,
      tables: {
        id: 3,
        tableName: 'T3',
        tablestatus: 'ENGAGED',
      },
    },
    {
      id: 14,
      menuIdsandQty: [
        {
          id: 11,
          name: 'Chicken Manchurian',
          dishQty: 'full',
          orderQty: 2,
          price: '89',
          allDishQty: [{ id: 12, qtyName: 'full', orderQty: 2 }],
          orderTotal: 178,
        },
      ],
      waiterName: 'manju',
      note: 'testing data orders',
      orderDate: '2021-02-16',
      orderstatus: null,
      menu: null,
      tables: {
        id: 14,
        tableName: 'T6',
        tablestatus: 'ENGAGED',
      },
    },
  ];
  changedOrderStatus: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  radioChange(event: MatRadioChange, order) {
    console.log(event.value, order.id);
    this.changedOrderStatus;
    this.changedOrderStatus = this.orders.find(OrderStatus => OrderStatus.id == order.id);
    this.changedOrderStatus.orderstatus = event.value;
    console.log('completed order', this.changedOrderStatus);
    if (this.changedOrderStatus.orderstatus == 'Completed') {
      this.completedOrders.push(order);
      this.orders = this.orders.filter(item => item.id !== order.id);
      console.log(' changedOrderStatus order list', this.completedOrders, this.orders);
    }
  }
}
