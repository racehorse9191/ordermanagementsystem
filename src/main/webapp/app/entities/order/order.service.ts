import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { IOrder } from '../../shared/model/order.model';
import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { DATE_FORMAT } from '../../shared/constants/input.constants';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';

type EntityResponseType = HttpResponse<IOrder>;
type EntityArrayResponseType = HttpResponse<IOrder[]>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  public resourceUrl = SERVER_API_URL + 'api/orders';

  constructor(protected http: HttpClient) {}

  create(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .post<IOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .put<IOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getByOrderStatus(req: OrderStatus): Observable<EntityArrayResponseType> {
    return this.http
      .get<IOrder[]>(`${this.resourceUrl}/status/${req}`, { observe: 'response' })
      .pipe(
        map((res: EntityArrayResponseType) => {
          this.convertDateArrayFromServer(res);
          this.convertMenuIdStringToJson(res);
          return res;
        })
      );
  }

  getUserOrderHistory(id: any, status: any, req?: any): Observable<EntityArrayResponseType> {
    let options: HttpParams = new HttpParams();
    if (req) {
      options = req;
    }
    return this.http
      .get<IOrder[]>(`${this.resourceUrl}/getUserOrderHistory/${id}/${status}`, { params: options, observe: 'response' })
      .pipe(
        map((res: EntityArrayResponseType) => {
          this.convertDateArrayFromServer(res);
          this.convertMenuIdStringToJson(res);
          return res;
        })
      );
  }
  /**
   *
   * @param tableId
   * gets orders by table Id
   */
  getByOrderTableId(tableId: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrder>(`${this.resourceUrl}/table/${tableId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(order: IOrder): IOrder {
    const copy: IOrder = Object.assign({}, order, {
      orderDate: order.orderDate && order.orderDate.isValid() ? order.orderDate.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.orderDate = res.body.orderDate ? moment(res.body.orderDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((order: IOrder) => {
        order.orderDate = order.orderDate ? moment(order.orderDate) : undefined;
      });
    }
    return res;
  }
  protected convertMenuIdStringToJson(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((order: IOrder) => {
        order.menuIdsandQty = JSON.parse(order.menuIdsandQty);
      });
    }
    return res;
  }
}
