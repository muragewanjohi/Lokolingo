import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChildLearningsComponent } from './list/child-learnings.component';
import { ChildLearningsDetailComponent } from './detail/child-learnings-detail.component';
import { ChildLearningsUpdateComponent } from './update/child-learnings-update.component';
import { ChildLearningsDeleteDialogComponent } from './delete/child-learnings-delete-dialog.component';
import { ChildLearningsRoutingModule } from './route/child-learnings-routing.module';

@NgModule({
  imports: [SharedModule, ChildLearningsRoutingModule],
  declarations: [
    ChildLearningsComponent,
    ChildLearningsDetailComponent,
    ChildLearningsUpdateComponent,
    ChildLearningsDeleteDialogComponent,
  ],
})
export class ChildLearningsModule {}
