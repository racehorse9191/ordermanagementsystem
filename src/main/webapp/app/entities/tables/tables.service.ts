import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITables } from '../../shared/model/tables.model';
import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';

type EntityResponseType = HttpResponse<ITables>;
type EntityArrayResponseType = HttpResponse<ITables[]>;

@Injectable({ providedIn: 'root' })
export class TablesService {
  public resourceUrl = SERVER_API_URL + 'api/tables';

  constructor(protected http: HttpClient) {}

  create(tables: ITables): Observable<EntityResponseType> {
    return this.http.post<ITables>(this.resourceUrl, tables, { observe: 'response' });
  }

  update(tables: ITables): Observable<EntityResponseType> {
    return this.http.put<ITables>(this.resourceUrl, tables, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITables>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITables[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
