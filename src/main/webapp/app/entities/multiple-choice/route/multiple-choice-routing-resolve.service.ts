import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMultipleChoice } from '../multiple-choice.model';
import { MultipleChoiceService } from '../service/multiple-choice.service';

@Injectable({ providedIn: 'root' })
export class MultipleChoiceRoutingResolveService implements Resolve<IMultipleChoice | null> {
  constructor(protected service: MultipleChoiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMultipleChoice | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((multipleChoice: HttpResponse<IMultipleChoice>) => {
          if (multipleChoice.body) {
            return of(multipleChoice.body);
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
