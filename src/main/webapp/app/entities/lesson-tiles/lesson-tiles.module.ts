import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LessonTilesComponent } from './list/lesson-tiles.component';
import { LessonTilesDetailComponent } from './detail/lesson-tiles-detail.component';
import { LessonTilesUpdateComponent } from './update/lesson-tiles-update.component';
import { LessonTilesDeleteDialogComponent } from './delete/lesson-tiles-delete-dialog.component';
import { LessonTilesRoutingModule } from './route/lesson-tiles-routing.module';

@NgModule({
  imports: [SharedModule, LessonTilesRoutingModule],
  declarations: [LessonTilesComponent, LessonTilesDetailComponent, LessonTilesUpdateComponent, LessonTilesDeleteDialogComponent],
})
export class LessonTilesModule {}
