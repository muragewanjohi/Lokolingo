import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TileFormService, TileFormGroup } from './tile-form.service';
import { ITile } from '../tile.model';
import { TileService } from '../service/tile.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { LockedStatus } from 'app/entities/enumerations/locked-status.model';

@Component({
  selector: 'jhi-tile-update',
  templateUrl: './tile-update.component.html',
})
export class TileUpdateComponent implements OnInit {
  isSaving = false;
  tile: ITile | null = null;
  lockedStatusValues = Object.keys(LockedStatus);

  questionsSharedCollection: IQuestion[] = [];

  editForm: TileFormGroup = this.tileFormService.createTileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected tileService: TileService,
    protected tileFormService: TileFormService,
    protected questionService: QuestionService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tile }) => {
      this.tile = tile;
      if (tile) {
        this.updateForm(tile);
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
    const tile = this.tileFormService.getTile(this.editForm);
    if (tile.id !== null) {
      this.subscribeToSaveResponse(this.tileService.update(tile));
    } else {
      this.subscribeToSaveResponse(this.tileService.create(tile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITile>>): void {
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

  protected updateForm(tile: ITile): void {
    this.tile = tile;
    this.tileFormService.resetForm(this.editForm, tile);

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing<IQuestion>(
      this.questionsSharedCollection,
      tile.question
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) => this.questionService.addQuestionToCollectionIfMissing<IQuestion>(questions, this.tile?.question))
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
