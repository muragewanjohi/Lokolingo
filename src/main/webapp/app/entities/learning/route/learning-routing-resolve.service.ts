import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILearning } from '../learning.model';
import { LearningService } from '../service/learning.service';

@Injectable({ providedIn: 'root' })
export class LearningRoutingResolveService implements Resolve<ILearning | null> {
  constructor(protected service: LearningService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILearning | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((learning: HttpResponse<ILearning>) => {
          if (learning.body) {
            return of(learning.body);
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
