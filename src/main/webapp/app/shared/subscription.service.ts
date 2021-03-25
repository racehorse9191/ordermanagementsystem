import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private selectedOrder: BehaviorSubject<Array<any>> = new BehaviorSubject<any[]>([]);
  public selectedorderOrderObservable = this.selectedOrder.asObservable();

  constructor() {}

  updateOrder(orderList: any[]) {
    this.selectedOrder.next(orderList);
  }

  getOrdersSelected(): Observable<any> {
    return this.selectedOrder.asObservable();
  }
}
