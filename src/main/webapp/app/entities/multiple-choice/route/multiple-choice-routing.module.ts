import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MultipleChoiceComponent } from '../list/multiple-choice.component';
import { MultipleChoiceDetailComponent } from '../detail/multiple-choice-detail.component';
import { MultipleChoiceUpdateComponent } from '../update/multiple-choice-update.component';
import { MultipleChoiceRoutingResolveService } from './multiple-choice-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const multipleChoiceRoute: Routes = [
  {
    path: '',
    component: MultipleChoiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MultipleChoiceDetailComponent,
    resolve: {
      multipleChoice: MultipleChoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MultipleChoiceUpdateComponent,
    resolve: {
      multipleChoice: MultipleChoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MultipleChoiceUpdateComponent,
    resolve: {
      multipleChoice: MultipleChoiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(multipleChoiceRoute)],
  exports: [RouterModule],
})
export class MultipleChoiceRoutingModule {}
