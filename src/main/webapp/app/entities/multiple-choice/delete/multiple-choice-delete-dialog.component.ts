import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMultipleChoice } from '../multiple-choice.model';
import { MultipleChoiceService } from '../service/multiple-choice.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './multiple-choice-delete-dialog.component.html',
})
export class MultipleChoiceDeleteDialogComponent {
  multipleChoice?: IMultipleChoice;

  constructor(protected multipleChoiceService: MultipleChoiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.multipleChoiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
