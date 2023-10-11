import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChild } from '../child.model';
import { ChildService } from '../service/child.service';

@Injectable({ providedIn: 'root' })
export class ChildRoutingResolveService implements Resolve<IChild | null> {
  constructor(protected service: ChildService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChild | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((child: HttpResponse<IChild>) => {
          if (child.body) {
            return of(child.body);
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
