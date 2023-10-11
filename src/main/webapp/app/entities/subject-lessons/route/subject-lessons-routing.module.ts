import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubjectLessonsComponent } from '../list/subject-lessons.component';
import { SubjectLessonsDetailComponent } from '../detail/subject-lessons-detail.component';
import { SubjectLessonsUpdateComponent } from '../update/subject-lessons-update.component';
import { SubjectLessonsRoutingResolveService } from './subject-lessons-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const subjectLessonsRoute: Routes = [
  {
    path: '',
    component: SubjectLessonsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubjectLessonsDetailComponent,
    resolve: {
      subjectLessons: SubjectLessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubjectLessonsUpdateComponent,
    resolve: {
      subjectLessons: SubjectLessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubjectLessonsUpdateComponent,
    resolve: {
      subjectLessons: SubjectLessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subjectLessonsRoute)],
  exports: [RouterModule],
})
export class SubjectLessonsRoutingModule {}
