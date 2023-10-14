import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChildLearningsFormService, ChildLearningsFormGroup } from './child-learnings-form.service';
import { IChildLearnings } from '../child-learnings.model';
import { ChildLearningsService } from '../service/child-learnings.service';
import { IChild } from 'app/entities/child/child.model';
import { ChildService } from 'app/entities/child/service/child.service';
import { ILearning } from 'app/entities/learning/learning.model';
import { LearningService } from 'app/entities/learning/service/learning.service';
import { FormatMediumDatePipe } from '../../../shared/date/format-medium-date.pipe';

@Component({
  selector: 'jhi-child-learnings-update',
  templateUrl: './child-learnings-update.component.html',
  providers: [FormatMediumDatePipe],
})
export class ChildLearningsUpdateComponent implements OnInit {
  isSaving = false;
  childLearnings: IChildLearnings | null = null;

  childrenSharedCollection: IChild[] = [];
  learningsSharedCollection: ILearning[] = [];

  editForm: ChildLearningsFormGroup = this.childLearningsFormService.createChildLearningsFormGroup();

  constructor(
    protected childLearningsService: ChildLearningsService,
    protected childLearningsFormService: ChildLearningsFormService,
    protected childService: ChildService,
    protected learningService: LearningService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChild = (o1: IChild | null, o2: IChild | null): boolean => this.childService.compareChild(o1, o2);

  compareLearning = (o1: ILearning | null, o2: ILearning | null): boolean => this.learningService.compareLearning(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ childLearnings }) => {
      this.childLearnings = childLearnings;
      if (childLearnings) {
        this.updateForm(childLearnings);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const childLearnings = this.childLearningsFormService.getChildLearnings(this.editForm);
    if (childLearnings.id !== null) {
      this.subscribeToSaveResponse(this.childLearningsService.update(childLearnings));
    } else {
      this.subscribeToSaveResponse(this.childLearningsService.create(childLearnings));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChildLearnings>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(childLearnings: IChildLearnings): void {
    this.childLearnings = childLearnings;
    this.childLearningsFormService.resetForm(this.editForm, childLearnings);

    this.childrenSharedCollection = this.childService.addChildToCollectionIfMissing<IChild>(
      this.childrenSharedCollection,
      childLearnings.child
    );
    this.learningsSharedCollection = this.learningService.addLearningToCollectionIfMissing<ILearning>(
      this.learningsSharedCollection,
      childLearnings.learning
    );
  }

  protected loadRelationshipsOptions(): void {
    this.childService
      .query()
      .pipe(map((res: HttpResponse<IChild[]>) => res.body ?? []))
      .pipe(map((children: IChild[]) => this.childService.addChildToCollectionIfMissing<IChild>(children, this.childLearnings?.child)))
      .subscribe((children: IChild[]) => (this.childrenSharedCollection = children));

    this.learningService
      .query()
      .pipe(map((res: HttpResponse<ILearning[]>) => res.body ?? []))
      .pipe(
        map((learnings: ILearning[]) =>
          this.learningService.addLearningToCollectionIfMissing<ILearning>(learnings, this.childLearnings?.learning)
        )
      )
      .subscribe((learnings: ILearning[]) => (this.learningsSharedCollection = learnings));
  }
}
