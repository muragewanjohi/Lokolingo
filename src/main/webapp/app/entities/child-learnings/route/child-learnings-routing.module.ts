import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChildLearningsComponent } from '../list/child-learnings.component';
import { ChildLearningsDetailComponent } from '../detail/child-learnings-detail.component';
import { ChildLearningsUpdateComponent } from '../update/child-learnings-update.component';
import { ChildLearningsRoutingResolveService } from './child-learnings-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const childLearningsRoute: Routes = [
  {
    path: '',
    component: ChildLearningsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChildLearningsDetailComponent,
    resolve: {
      childLearnings: ChildLearningsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChildLearningsUpdateComponent,
    resolve: {
      childLearnings: ChildLearningsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChildLearningsUpdateComponent,
    resolve: {
      childLearnings: ChildLearningsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(childLearningsRoute)],
  exports: [RouterModule],
})
export class ChildLearningsRoutingModule {}
