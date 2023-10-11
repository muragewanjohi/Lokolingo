import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MultipleChoiceFormService, MultipleChoiceFormGroup } from './multiple-choice-form.service';
import { IMultipleChoice } from '../multiple-choice.model';
import { MultipleChoiceService } from '../service/multiple-choice.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { AnswerStatus } from 'app/entities/enumerations/answer-status.model';

@Component({
  selector: 'jhi-multiple-choice-update',
  templateUrl: './multiple-choice-update.component.html',
})
export class MultipleChoiceUpdateComponent implements OnInit {
  isSaving = false;
  multipleChoice: IMultipleChoice | null = null;
  answerStatusValues = Object.keys(AnswerStatus);

  questionsSharedCollection: IQuestion[] = [];

  editForm: MultipleChoiceFormGroup = this.multipleChoiceFormService.createMultipleChoiceFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected multipleChoiceService: MultipleChoiceService,
    protected multipleChoiceFormService: MultipleChoiceFormService,
    protected questionService: QuestionService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ multipleChoice }) => {
      this.multipleChoice = multipleChoice;
      if (multipleChoice) {
        this.updateForm(multipleChoice);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('lokolingoApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const multipleChoice = this.multipleChoiceFormService.getMultipleChoice(this.editForm);
    if (multipleChoice.id !== null) {
      this.subscribeToSaveResponse(this.multipleChoiceService.update(multipleChoice));
    } else {
      this.subscribeToSaveResponse(this.multipleChoiceService.create(multipleChoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMultipleChoice>>): void {
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

  protected updateForm(multipleChoice: IMultipleChoice): void {
    this.multipleChoice = multipleChoice;
    this.multipleChoiceFormService.resetForm(this.editForm, multipleChoice);

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing<IQuestion>(
      this.questionsSharedCollection,
      multipleChoice.question
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing<IQuestion>(questions, this.multipleChoice?.question)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
