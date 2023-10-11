import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChildLearnings, NewChildLearnings } from '../child-learnings.model';

export type PartialUpdateChildLearnings = Partial<IChildLearnings> & Pick<IChildLearnings, 'id'>;

type RestOf<T extends IChildLearnings | NewChildLearnings> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestChildLearnings = RestOf<IChildLearnings>;

export type NewRestChildLearnings = RestOf<NewChildLearnings>;

export type PartialUpdateRestChildLearnings = RestOf<PartialUpdateChildLearnings>;

export type EntityResponseType = HttpResponse<IChildLearnings>;
export type EntityArrayResponseType = HttpResponse<IChildLearnings[]>;

@Injectable({ providedIn: 'root' })
export class ChildLearningsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/child-learnings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(childLearnings: NewChildLearnings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(childLearnings);
    return this.http
      .post<RestChildLearnings>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(childLearnings: IChildLearnings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(childLearnings);
    return this.http
      .put<RestChildLearnings>(`${this.resourceUrl}/${this.getChildLearningsIdentifier(childLearnings)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(childLearnings: PartialUpdateChildLearnings): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(childLearnings);
    return this.http
      .patch<RestChildLearnings>(`${this.resourceUrl}/${this.getChildLearningsIdentifier(childLearnings)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestChildLearnings>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestChildLearnings[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChildLearningsIdentifier(childLearnings: Pick<IChildLearnings, 'id'>): number {
    return childLearnings.id;
  }

  compareChildLearnings(o1: Pick<IChildLearnings, 'id'> | null, o2: Pick<IChildLearnings, 'id'> | null): boolean {
    return o1 && o2 ? this.getChildLearningsIdentifier(o1) === this.getChildLearningsIdentifier(o2) : o1 === o2;
  }

  addChildLearningsToCollectionIfMissing<Type extends Pick<IChildLearnings, 'id'>>(
    childLearningsCollection: Type[],
    ...childLearningsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const childLearnings: Type[] = childLearningsToCheck.filter(isPresent);
    if (childLearnings.length > 0) {
      const childLearningsCollectionIdentifiers = childLearningsCollection.map(
        childLearningsItem => this.getChildLearningsIdentifier(childLearningsItem)!
      );
      const childLearningsToAdd = childLearnings.filter(childLearningsItem => {
        const childLearningsIdentifier = this.getChildLearningsIdentifier(childLearningsItem);
        if (childLearningsCollectionIdentifiers.includes(childLearningsIdentifier)) {
          return false;
        }
        childLearningsCollectionIdentifiers.push(childLearningsIdentifier);
        return true;
      });
      return [...childLearningsToAdd, ...childLearningsCollection];
    }
    return childLearningsCollection;
  }

  protected convertDateFromClient<T extends IChildLearnings | NewChildLearnings | PartialUpdateChildLearnings>(
    childLearnings: T
  ): RestOf<T> {
    return {
      ...childLearnings,
      createdAt: childLearnings.createdAt?.toJSON() ?? null,
      updatedAt: childLearnings.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restChildLearnings: RestChildLearnings): IChildLearnings {
    return {
      ...restChildLearnings,
      createdAt: restChildLearnings.createdAt ? dayjs(restChildLearnings.createdAt) : undefined,
      updatedAt: restChildLearnings.updatedAt ? dayjs(restChildLearnings.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestChildLearnings>): HttpResponse<IChildLearnings> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestChildLearnings[]>): HttpResponse<IChildLearnings[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
