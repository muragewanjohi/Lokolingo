import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILesson } from '../lesson.model';
import { LessonService } from '../service/lesson.service';

@Injectable({ providedIn: 'root' })
export class LessonRoutingResolveService implements Resolve<ILesson | null> {
  constructor(protected service: LessonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILesson | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lesson: HttpResponse<ILesson>) => {
          if (lesson.body) {
            return of(lesson.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
