import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILearning, NewLearning } from '../learning.model';

export type PartialUpdateLearning = Partial<ILearning> & Pick<ILearning, 'id'>;

type RestOf<T extends ILearning | NewLearning> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestLearning = RestOf<ILearning>;

export type NewRestLearning = RestOf<NewLearning>;

export type PartialUpdateRestLearning = RestOf<PartialUpdateLearning>;

export type EntityResponseType = HttpResponse<ILearning>;
export type EntityArrayResponseType = HttpResponse<ILearning[]>;

@Injectable({ providedIn: 'root' })
export class LearningService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/learnings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(learning: NewLearning): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learning);
    return this.http
      .post<RestLearning>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(learning: ILearning): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learning);
    return this.http
      .put<RestLearning>(`${this.resourceUrl}/${this.getLearningIdentifier(learning)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(learning: PartialUpdateLearning): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learning);
    return this.http
      .patch<RestLearning>(`${this.resourceUrl}/${this.getLearningIdentifier(learning)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLearning>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLearning[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLearningIdentifier(learning: Pick<ILearning, 'id'>): number {
    return learning.id;
  }

  compareLearning(o1: Pick<ILearning, 'id'> | null, o2: Pick<ILearning, 'id'> | null): boolean {
    return o1 && o2 ? this.getLearningIdentifier(o1) === this.getLearningIdentifier(o2) : o1 === o2;
  }

  addLearningToCollectionIfMissing<Type extends Pick<ILearning, 'id'>>(
    learningCollection: Type[],
    ...learningsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const learnings: Type[] = learningsToCheck.filter(isPresent);
    if (learnings.length > 0) {
      const learningCollectionIdentifiers = learningCollection.map(learningItem => this.getLearningIdentifier(learningItem)!);
      const learningsToAdd = learnings.filter(learningItem => {
        const learningIdentifier = this.getLearningIdentifier(learningItem);
        if (learningCollectionIdentifiers.includes(learningIdentifier)) {
          return false;
        }
        learningCollectionIdentifiers.push(learningIdentifier);
        return true;
      });
      return [...learningsToAdd, ...learningCollection];
    }
    return learningCollection;
  }

  protected convertDateFromClient<T extends ILearning | NewLearning | PartialUpdateLearning>(learning: T): RestOf<T> {
    return {
      ...learning,
      startDate: learning.startDate?.toJSON() ?? null,
      endDate: learning.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLearning: RestLearning): ILearning {
    return {
      ...restLearning,
      startDate: restLearning.startDate ? dayjs(restLearning.startDate) : undefined,
      endDate: restLearning.endDate ? dayjs(restLearning.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLearning>): HttpResponse<ILearning> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLearning[]>): HttpResponse<ILearning[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
