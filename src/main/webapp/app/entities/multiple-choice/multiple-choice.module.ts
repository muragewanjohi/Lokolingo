import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultipleChoiceComponent } from './list/multiple-choice.component';
import { MultipleChoiceDetailComponent } from './detail/multiple-choice-detail.component';
import { MultipleChoiceUpdateComponent } from './update/multiple-choice-update.component';
import { MultipleChoiceDeleteDialogComponent } from './delete/multiple-choice-delete-dialog.component';
import { MultipleChoiceRoutingModule } from './route/multiple-choice-routing.module';

@NgModule({
  imports: [SharedModule, MultipleChoiceRoutingModule],
  declarations: [
    MultipleChoiceComponent,
    MultipleChoiceDetailComponent,
    MultipleChoiceUpdateComponent,
    MultipleChoiceDeleteDialogComponent,
  ],
})
export class MultipleChoiceModule {}
