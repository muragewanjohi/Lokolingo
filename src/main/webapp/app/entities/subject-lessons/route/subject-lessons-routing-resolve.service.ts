import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubjectLessons } from '../subject-lessons.model';
import { SubjectLessonsService } from '../service/subject-lessons.service';

@Injectable({ providedIn: 'root' })
export class SubjectLessonsRoutingResolveService implements Resolve<ISubjectLessons | null> {
  constructor(protected service: SubjectLessonsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISubjectLessons | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((subjectLessons: HttpResponse<ISubjectLessons>) => {
          if (subjectLessons.body) {
            return of(subjectLessons.body);
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
