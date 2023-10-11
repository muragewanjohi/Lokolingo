import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILessonTiles } from '../lesson-tiles.model';
import { LessonTilesService } from '../service/lesson-tiles.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './lesson-tiles-delete-dialog.component.html',
})
export class LessonTilesDeleteDialogComponent {
  lessonTiles?: ILessonTiles;

  constructor(protected lessonTilesService: LessonTilesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lessonTilesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
