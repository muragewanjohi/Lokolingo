import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LearningComponent } from '../list/learning.component';
import { LearningDetailComponent } from '../detail/learning-detail.component';
import { LearningUpdateComponent } from '../update/learning-update.component';
import { LearningRoutingResolveService } from './learning-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const learningRoute: Routes = [
  {
    path: '',
    component: LearningComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LearningDetailComponent,
    resolve: {
      learning: LearningRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LearningUpdateComponent,
    resolve: {
      learning: LearningRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LearningUpdateComponent,
    resolve: {
      learning: LearningRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(learningRoute)],
  exports: [RouterModule],
})
export class LearningRoutingModule {}
