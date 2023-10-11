import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChildLearnings } from '../child-learnings.model';
import { ChildLearningsService } from '../service/child-learnings.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './child-learnings-delete-dialog.component.html',
})
export class ChildLearningsDeleteDialogComponent {
  childLearnings?: IChildLearnings;

  constructor(protected childLearningsService: ChildLearningsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.childLearningsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
