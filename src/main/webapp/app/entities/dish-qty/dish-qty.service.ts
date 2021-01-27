import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDishQty } from 'app/shared/model/dish-qty.model';

type EntityResponseType = HttpResponse<IDishQty>;
type EntityArrayResponseType = HttpResponse<IDishQty[]>;

@Injectable({ providedIn: 'root' })
export class DishQtyService {
  public resourceUrl = SERVER_API_URL + 'api/dish-qties';

  constructor(protected http: HttpClient) {}

  create(dishQty: IDishQty): Observable<EntityResponseType> {
    return this.http.post<IDishQty>(this.resourceUrl, dishQty, { observe: 'response' });
  }

  update(dishQty: IDishQty): Observable<EntityResponseType> {
    return this.http.put<IDishQty>(this.resourceUrl, dishQty, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDishQty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDishQty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
