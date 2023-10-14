import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChild } from '../child.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ChildService } from '../service/child.service';
import { ChildDeleteDialogComponent } from '../delete/child-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';

@Component({
  selector: 'jhi-child',
  templateUrl: './child.component.html',
})
export class ChildComponent implements OnInit {
  children?: IChild[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  userId: number = 0;

  adminUser: boolean = false;

  authorities: any;
  currentUser: any;

  constructor(
    protected childService: ChildService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private accountService: AccountService
  ) {}

  trackId = (_index: number, item: IChild): number => this.childService.getChildIdentifier(item);

  ngOnInit(): void {
    this.accountService.identity().subscribe((user: Account | null) => {
      this.authorities = user?.authorities;
      this.currentUser = user?.login;

      this.authorities.forEach((element: string) => {
        if (element == 'ROLE_ADMIN') {
          this.adminUser = true;
        }
      });
      //console.log('Account ' + user?.login);
      console.log('adminUser ' + this.adminUser);

      this.load();
    });

    //this.load();
  }

  delete(child: IChild): void {
    const modalRef = this.modalService.open(ChildDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.child = child;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.children = this.refineData(dataFromBody);
  }

  protected refineData(data: IChild[]): IChild[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IChild[] | null): IChild[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    //return this.childService.query(queryObject).pipe(tap(() => (this.isLoading = false)));

    if (this.adminUser) {
      console.log('Querying as admin');
      return this.childService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
    } else {
      console.log('Querying as normal user');
      return this.childService.queryByParent(this.currentUser, queryObject).pipe(tap(() => (this.isLoading = false)));
    }
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
