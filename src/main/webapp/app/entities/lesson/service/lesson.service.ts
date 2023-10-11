import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILesson, NewLesson } from '../lesson.model';

export type PartialUpdateLesson = Partial<ILesson> & Pick<ILesson, 'id'>;

export type EntityResponseType = HttpResponse<ILesson>;
export type EntityArrayResponseType = HttpResponse<ILesson[]>;

@Injectable({ providedIn: 'root' })
export class LessonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lessons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lesson: NewLesson): Observable<EntityResponseType> {
    return this.http.post<ILesson>(this.resourceUrl, lesson, { observe: 'response' });
  }

  update(lesson: ILesson): Observable<EntityResponseType> {
    return this.http.put<ILesson>(`${this.resourceUrl}/${this.getLessonIdentifier(lesson)}`, lesson, { observe: 'response' });
  }

  partialUpdate(lesson: PartialUpdateLesson): Observable<EntityResponseType> {
    return this.http.patch<ILesson>(`${this.resourceUrl}/${this.getLessonIdentifier(lesson)}`, lesson, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILesson>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILesson[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLessonIdentifier(lesson: Pick<ILesson, 'id'>): number {
    return lesson.id;
  }

  compareLesson(o1: Pick<ILesson, 'id'> | null, o2: Pick<ILesson, 'id'> | null): boolean {
    return o1 && o2 ? this.getLessonIdentifier(o1) === this.getLessonIdentifier(o2) : o1 === o2;
  }

  addLessonToCollectionIfMissing<Type extends Pick<ILesson, 'id'>>(
    lessonCollection: Type[],
    ...lessonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lessons: Type[] = lessonsToCheck.filter(isPresent);
    if (lessons.length > 0) {
      const lessonCollectionIdentifiers = lessonCollection.map(lessonItem => this.getLessonIdentifier(lessonItem)!);
      const lessonsToAdd = lessons.filter(lessonItem => {
        const lessonIdentifier = this.getLessonIdentifier(lessonItem);
        if (lessonCollectionIdentifiers.includes(lessonIdentifier)) {
          return false;
        }
        lessonCollectionIdentifiers.push(lessonIdentifier);
        return true;
      });
      return [...lessonsToAdd, ...lessonCollection];
    }
    return lessonCollection;
  }
}
