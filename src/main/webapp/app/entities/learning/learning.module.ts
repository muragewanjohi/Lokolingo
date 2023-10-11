import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LearningComponent } from './list/learning.component';
import { LearningDetailComponent } from './detail/learning-detail.component';
import { LearningUpdateComponent } from './update/learning-update.component';
import { LearningDeleteDialogComponent } from './delete/learning-delete-dialog.component';
import { LearningRoutingModule } from './route/learning-routing.module';

@NgModule({
  imports: [SharedModule, LearningRoutingModule],
  declarations: [LearningComponent, LearningDetailComponent, LearningUpdateComponent, LearningDeleteDialogComponent],
})
export class LearningModule {}
