import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChildLearnings } from '../child-learnings.model';
import { ChildLearningsService } from '../service/child-learnings.service';

@Injectable({ providedIn: 'root' })
export class ChildLearningsRoutingResolveService implements Resolve<IChildLearnings | null> {
  constructor(protected service: ChildLearningsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChildLearnings | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((childLearnings: HttpResponse<IChildLearnings>) => {
          if (childLearnings.body) {
            return of(childLearnings.body);
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
