import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SubjectLessonsFormService, SubjectLessonsFormGroup } from './subject-lessons-form.service';
import { ISubjectLessons } from '../subject-lessons.model';
import { SubjectLessonsService } from '../service/subject-lessons.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';

@Component({
  selector: 'jhi-subject-lessons-update',
  templateUrl: './subject-lessons-update.component.html',
})
export class SubjectLessonsUpdateComponent implements OnInit {
  isSaving = false;
  subjectLessons: ISubjectLessons | null = null;

  subjectsSharedCollection: ISubject[] = [];
  lessonsSharedCollection: ILesson[] = [];

  editForm: SubjectLessonsFormGroup = this.subjectLessonsFormService.createSubjectLessonsFormGroup();

  constructor(
    protected subjectLessonsService: SubjectLessonsService,
    protected subjectLessonsFormService: SubjectLessonsFormService,
    protected subjectService: SubjectService,
    protected lessonService: LessonService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSubject = (o1: ISubject | null, o2: ISubject | null): boolean => this.subjectService.compareSubject(o1, o2);

  compareLesson = (o1: ILesson | null, o2: ILesson | null): boolean => this.lessonService.compareLesson(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjectLessons }) => {
      this.subjectLessons = subjectLessons;
      if (subjectLessons) {
        this.updateForm(subjectLessons);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subjectLessons = this.subjectLessonsFormService.getSubjectLessons(this.editForm);
    if (subjectLessons.id !== null) {
      this.subscribeToSaveResponse(this.subjectLessonsService.update(subjectLessons));
    } else {
      this.subscribeToSaveResponse(this.subjectLessonsService.create(subjectLessons));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubjectLessons>>): void {
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

  protected updateForm(subjectLessons: ISubjectLessons): void {
    this.subjectLessons = subjectLessons;
    this.subjectLessonsFormService.resetForm(this.editForm, subjectLessons);

    this.subjectsSharedCollection = this.subjectService.addSubjectToCollectionIfMissing<ISubject>(
      this.subjectsSharedCollection,
      subjectLessons.subject
    );
    this.lessonsSharedCollection = this.lessonService.addLessonToCollectionIfMissing<ILesson>(
      this.lessonsSharedCollection,
      subjectLessons.lesson
    );
  }

  protected loadRelationshipsOptions(): void {
    this.subjectService
      .query()
      .pipe(map((res: HttpResponse<ISubject[]>) => res.body ?? []))
      .pipe(
        map((subjects: ISubject[]) => this.subjectService.addSubjectToCollectionIfMissing<ISubject>(subjects, this.subjectLessons?.subject))
      )
      .subscribe((subjects: ISubject[]) => (this.subjectsSharedCollection = subjects));

    this.lessonService
      .query()
      .pipe(map((res: HttpResponse<ILesson[]>) => res.body ?? []))
      .pipe(map((lessons: ILesson[]) => this.lessonService.addLessonToCollectionIfMissing<ILesson>(lessons, this.subjectLessons?.lesson)))
      .subscribe((lessons: ILesson[]) => (this.lessonsSharedCollection = lessons));
  }
}
