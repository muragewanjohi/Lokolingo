import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LessonTilesComponent } from '../list/lesson-tiles.component';
import { LessonTilesDetailComponent } from '../detail/lesson-tiles-detail.component';
import { LessonTilesUpdateComponent } from '../update/lesson-tiles-update.component';
import { LessonTilesRoutingResolveService } from './lesson-tiles-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lessonTilesRoute: Routes = [
  {
    path: '',
    component: LessonTilesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LessonTilesDetailComponent,
    resolve: {
      lessonTiles: LessonTilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LessonTilesUpdateComponent,
    resolve: {
      lessonTiles: LessonTilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LessonTilesUpdateComponent,
    resolve: {
      lessonTiles: LessonTilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lessonTilesRoute)],
  exports: [RouterModule],
})
export class LessonTilesRoutingModule {}
