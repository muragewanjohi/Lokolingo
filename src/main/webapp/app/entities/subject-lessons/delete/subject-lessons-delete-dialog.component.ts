import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubjectLessons } from '../subject-lessons.model';
import { SubjectLessonsService } from '../service/subject-lessons.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './subject-lessons-delete-dialog.component.html',
})
export class SubjectLessonsDeleteDialogComponent {
  subjectLessons?: ISubjectLessons;

  constructor(protected subjectLessonsService: SubjectLessonsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subjectLessonsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
