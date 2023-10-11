import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubjectLessonsComponent } from './list/subject-lessons.component';
import { SubjectLessonsDetailComponent } from './detail/subject-lessons-detail.component';
import { SubjectLessonsUpdateComponent } from './update/subject-lessons-update.component';
import { SubjectLessonsDeleteDialogComponent } from './delete/subject-lessons-delete-dialog.component';
import { SubjectLessonsRoutingModule } from './route/subject-lessons-routing.module';

@NgModule({
  imports: [SharedModule, SubjectLessonsRoutingModule],
  declarations: [
    SubjectLessonsComponent,
    SubjectLessonsDetailComponent,
    SubjectLessonsUpdateComponent,
    SubjectLessonsDeleteDialogComponent,
  ],
})
export class SubjectLessonsModule {}
