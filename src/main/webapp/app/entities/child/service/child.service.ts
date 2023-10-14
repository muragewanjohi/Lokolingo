import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChild, NewChild } from '../child.model';

export type PartialUpdateChild = Partial<IChild> & Pick<IChild, 'id'>;

export type EntityResponseType = HttpResponse<IChild>;
export type EntityArrayResponseType = HttpResponse<IChild[]>;

@Injectable({ providedIn: 'root' })
export class ChildService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/children');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(child: NewChild): Observable<EntityResponseType> {
    return this.http.post<IChild>(this.resourceUrl, child, { observe: 'response' });
  }

  update(child: IChild): Observable<EntityResponseType> {
    return this.http.put<IChild>(`${this.resourceUrl}/${this.getChildIdentifier(child)}`, child, { observe: 'response' });
  }

  partialUpdate(child: PartialUpdateChild): Observable<EntityResponseType> {
    return this.http.patch<IChild>(`${this.resourceUrl}/${this.getChildIdentifier(child)}`, child, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChild>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChild[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryByParent(parentUserLogin: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChild[]>(`${this.resourceUrl + '/parent'}/${parentUserLogin}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChildIdentifier(child: Pick<IChild, 'id'>): number {
    return child.id;
  }

  compareChild(o1: Pick<IChild, 'id'> | null, o2: Pick<IChild, 'id'> | null): boolean {
    return o1 && o2 ? this.getChildIdentifier(o1) === this.getChildIdentifier(o2) : o1 === o2;
  }

  addChildToCollectionIfMissing<Type extends Pick<IChild, 'id'>>(
    childCollection: Type[],
    ...childrenToCheck: (Type | null | undefined)[]
  ): Type[] {
    const children: Type[] = childrenToCheck.filter(isPresent);
    if (children.length > 0) {
      const childCollectionIdentifiers = childCollection.map(childItem => this.getChildIdentifier(childItem)!);
      const childrenToAdd = children.filter(childItem => {
        const childIdentifier = this.getChildIdentifier(childItem);
        if (childCollectionIdentifiers.includes(childIdentifier)) {
          return false;
        }
        childCollectionIdentifiers.push(childIdentifier);
        return true;
      });
      return [...childrenToAdd, ...childCollection];
    }
    return childCollection;
  }
}
