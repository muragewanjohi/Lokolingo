import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LearningFormService, LearningFormGroup } from './learning-form.service';
import { ILearning } from '../learning.model';
import { LearningService } from '../service/learning.service';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';

@Component({
  selector: 'jhi-learning-update',
  templateUrl: './learning-update.component.html',
})
export class LearningUpdateComponent implements OnInit {
  isSaving = false;
  learning: ILearning | null = null;

  lessonsSharedCollection: ILesson[] = [];

  editForm: LearningFormGroup = this.learningFormService.createLearningFormGroup();

  constructor(
    protected learningService: LearningService,
    protected learningFormService: LearningFormService,
    protected lessonService: LessonService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLesson = (o1: ILesson | null, o2: ILesson | null): boolean => this.lessonService.compareLesson(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ learning }) => {
      this.learning = learning;
      if (learning) {
        this.updateForm(learning);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const learning = this.learningFormService.getLearning(this.editForm);
    if (learning.id !== null) {
      this.subscribeToSaveResponse(this.learningService.update(learning));
    } else {
      this.subscribeToSaveResponse(this.learningService.create(learning));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILearning>>): void {
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

  protected updateForm(learning: ILearning): void {
    this.learning = learning;
    this.learningFormService.resetForm(this.editForm, learning);

    this.lessonsSharedCollection = this.lessonService.addLessonToCollectionIfMissing<ILesson>(
      this.lessonsSharedCollection,
      learning.lesson
    );
  }

  protected loadRelationshipsOptions(): void {
    this.lessonService
      .query()
      .pipe(map((res: HttpResponse<ILesson[]>) => res.body ?? []))
      .pipe(map((lessons: ILesson[]) => this.lessonService.addLessonToCollectionIfMissing<ILesson>(lessons, this.learning?.lesson)))
      .subscribe((lessons: ILesson[]) => (this.lessonsSharedCollection = lessons));
  }
}
