import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILessonTiles, NewLessonTiles } from '../lesson-tiles.model';

export type PartialUpdateLessonTiles = Partial<ILessonTiles> & Pick<ILessonTiles, 'id'>;

type RestOf<T extends ILessonTiles | NewLessonTiles> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestLessonTiles = RestOf<ILessonTiles>;

export type NewRestLessonTiles = RestOf<NewLessonTiles>;

export type PartialUpdateRestLessonTiles = RestOf<PartialUpdateLessonTiles>;

export type EntityResponseType = HttpResponse<ILessonTiles>;
export type EntityArrayResponseType = HttpResponse<ILessonTiles[]>;

@Injectable({ providedIn: 'root' })
export class LessonTilesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lesson-tiles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lessonTiles: NewLessonTiles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessonTiles);
    return this.http
      .post<RestLessonTiles>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(lessonTiles: ILessonTiles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessonTiles);
    return this.http
      .put<RestLessonTiles>(`${this.resourceUrl}/${this.getLessonTilesIdentifier(lessonTiles)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(lessonTiles: PartialUpdateLessonTiles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lessonTiles);
    return this.http
      .patch<RestLessonTiles>(`${this.resourceUrl}/${this.getLessonTilesIdentifier(lessonTiles)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLessonTiles>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLessonTiles[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLessonTilesIdentifier(lessonTiles: Pick<ILessonTiles, 'id'>): number {
    return lessonTiles.id;
  }

  compareLessonTiles(o1: Pick<ILessonTiles, 'id'> | null, o2: Pick<ILessonTiles, 'id'> | null): boolean {
    return o1 && o2 ? this.getLessonTilesIdentifier(o1) === this.getLessonTilesIdentifier(o2) : o1 === o2;
  }

  addLessonTilesToCollectionIfMissing<Type extends Pick<ILessonTiles, 'id'>>(
    lessonTilesCollection: Type[],
    ...lessonTilesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lessonTiles: Type[] = lessonTilesToCheck.filter(isPresent);
    if (lessonTiles.length > 0) {
      const lessonTilesCollectionIdentifiers = lessonTilesCollection.map(
        lessonTilesItem => this.getLessonTilesIdentifier(lessonTilesItem)!
      );
      const lessonTilesToAdd = lessonTiles.filter(lessonTilesItem => {
        const lessonTilesIdentifier = this.getLessonTilesIdentifier(lessonTilesItem);
        if (lessonTilesCollectionIdentifiers.includes(lessonTilesIdentifier)) {
          return false;
        }
        lessonTilesCollectionIdentifiers.push(lessonTilesIdentifier);
        return true;
      });
      return [...lessonTilesToAdd, ...lessonTilesCollection];
    }
    return lessonTilesCollection;
  }

  protected convertDateFromClient<T extends ILessonTiles | NewLessonTiles | PartialUpdateLessonTiles>(lessonTiles: T): RestOf<T> {
    return {
      ...lessonTiles,
      createdAt: lessonTiles.createdAt?.toJSON() ?? null,
      updatedAt: lessonTiles.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLessonTiles: RestLessonTiles): ILessonTiles {
    return {
      ...restLessonTiles,
      createdAt: restLessonTiles.createdAt ? dayjs(restLessonTiles.createdAt) : undefined,
      updatedAt: restLessonTiles.updatedAt ? dayjs(restLessonTiles.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLessonTiles>): HttpResponse<ILessonTiles> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLessonTiles[]>): HttpResponse<ILessonTiles[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
