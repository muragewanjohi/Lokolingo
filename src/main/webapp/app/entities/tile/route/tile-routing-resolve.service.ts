import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITile } from '../tile.model';
import { TileService } from '../service/tile.service';

@Injectable({ providedIn: 'root' })
export class TileRoutingResolveService implements Resolve<ITile | null> {
  constructor(protected service: TileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITile | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tile: HttpResponse<ITile>) => {
          if (tile.body) {
            return of(tile.body);
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
