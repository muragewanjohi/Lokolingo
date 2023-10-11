import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILessonTiles } from '../lesson-tiles.model';
import { LessonTilesService } from '../service/lesson-tiles.service';

@Injectable({ providedIn: 'root' })
export class LessonTilesRoutingResolveService implements Resolve<ILessonTiles | null> {
  constructor(protected service: LessonTilesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILessonTiles | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lessonTiles: HttpResponse<ILessonTiles>) => {
          if (lessonTiles.body) {
            return of(lessonTiles.body);
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
