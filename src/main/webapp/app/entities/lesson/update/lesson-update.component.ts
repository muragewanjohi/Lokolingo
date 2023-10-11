import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LessonFormService, LessonFormGroup } from './lesson-form.service';
import { ILesson } from '../lesson.model';
import { LessonService } from '../service/lesson.service';
import { Language } from 'app/entities/enumerations/language.model';
import { Level } from 'app/entities/enumerations/level.model';

@Component({
  selector: 'jhi-lesson-update',
  templateUrl: './lesson-update.component.html',
})
export class LessonUpdateComponent implements OnInit {
  isSaving = false;
  lesson: ILesson | null = null;
  languageValues = Object.keys(Language);
  levelValues = Object.keys(Level);

  editForm: LessonFormGroup = this.lessonFormService.createLessonFormGroup();

  constructor(
    protected lessonService: LessonService,
    protected lessonFormService: LessonFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lesson }) => {
      this.lesson = lesson;
      if (lesson) {
        this.updateForm(lesson);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lesson = this.lessonFormService.getLesson(this.editForm);
    if (lesson.id !== null) {
      this.subscribeToSaveResponse(this.lessonService.update(lesson));
    } else {
      this.subscribeToSaveResponse(this.lessonService.create(lesson));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILesson>>): void {
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

  protected updateForm(lesson: ILesson): void {
    this.lesson = lesson;
    this.lessonFormService.resetForm(this.editForm, lesson);
  }
}
