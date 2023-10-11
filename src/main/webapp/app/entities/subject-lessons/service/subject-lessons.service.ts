import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubjectLessons, NewSubjectLessons } from '../subject-lessons.model';

export type PartialUpdateSubjectLessons = Partial<ISubjectLessons> & Pick<ISubjectLessons, 'id'>;

type RestOf<T extends ISubjectLessons | NewSubjectLessons> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestSubjectLessons = RestOf<ISubjectLessons>;

export type NewRestSubjectLessons = RestOf<NewSubjectLessons>;

export type PartialUpdateRestSubjectLessons = RestOf<PartialUpdateSubjectLessons>;

export type EntityResponseType = HttpResponse<ISubjectLessons>;
export type EntityArrayResponseType = HttpResponse<ISubjectLessons[]>;

@Injectable({ providedIn: 'root' })
export class SubjectLessonsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subject-lessons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(subjectLessons: NewSubjectLessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subjectLessons);
    return this.http
      .post<RestSubjectLessons>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(subjectLessons: ISubjectLessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subjectLessons);
    return this.http
      .put<RestSubjectLessons>(`${this.resourceUrl}/${this.getSubjectLessonsIdentifier(subjectLessons)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(subjectLessons: PartialUpdateSubjectLessons): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subjectLessons);
    return this.http
      .patch<RestSubjectLessons>(`${this.resourceUrl}/${this.getSubjectLessonsIdentifier(subjectLessons)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSubjectLessons>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSubjectLessons[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSubjectLessonsIdentifier(subjectLessons: Pick<ISubjectLessons, 'id'>): number {
    return subjectLessons.id;
  }

  compareSubjectLessons(o1: Pick<ISubjectLessons, 'id'> | null, o2: Pick<ISubjectLessons, 'id'> | null): boolean {
    return o1 && o2 ? this.getSubjectLessonsIdentifier(o1) === this.getSubjectLessonsIdentifier(o2) : o1 === o2;
  }

  addSubjectLessonsToCollectionIfMissing<Type extends Pick<ISubjectLessons, 'id'>>(
    subjectLessonsCollection: Type[],
    ...subjectLessonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const subjectLessons: Type[] = subjectLessonsToCheck.filter(isPresent);
    if (subjectLessons.length > 0) {
      const subjectLessonsCollectionIdentifiers = subjectLessonsCollection.map(
        subjectLessonsItem => this.getSubjectLessonsIdentifier(subjectLessonsItem)!
      );
      const subjectLessonsToAdd = subjectLessons.filter(subjectLessonsItem => {
        const subjectLessonsIdentifier = this.getSubjectLessonsIdentifier(subjectLessonsItem);
        if (subjectLessonsCollectionIdentifiers.includes(subjectLessonsIdentifier)) {
          return false;
        }
        subjectLessonsCollectionIdentifiers.push(subjectLessonsIdentifier);
        return true;
      });
      return [...subjectLessonsToAdd, ...subjectLessonsCollection];
    }
    return subjectLessonsCollection;
  }

  protected convertDateFromClient<T extends ISubjectLessons | NewSubjectLessons | PartialUpdateSubjectLessons>(
    subjectLessons: T
  ): RestOf<T> {
    return {
      ...subjectLessons,
      createdAt: subjectLessons.createdAt?.toJSON() ?? null,
      updatedAt: subjectLessons.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSubjectLessons: RestSubjectLessons): ISubjectLessons {
    return {
      ...restSubjectLessons,
      createdAt: restSubjectLessons.createdAt ? dayjs(restSubjectLessons.createdAt) : undefined,
      updatedAt: restSubjectLessons.updatedAt ? dayjs(restSubjectLessons.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSubjectLessons>): HttpResponse<ISubjectLessons> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSubjectLessons[]>): HttpResponse<ISubjectLessons[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
