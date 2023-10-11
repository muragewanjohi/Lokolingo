import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LessonTilesFormService, LessonTilesFormGroup } from './lesson-tiles-form.service';
import { ILessonTiles } from '../lesson-tiles.model';
import { LessonTilesService } from '../service/lesson-tiles.service';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';
import { ITile } from 'app/entities/tile/tile.model';
import { TileService } from 'app/entities/tile/service/tile.service';

@Component({
  selector: 'jhi-lesson-tiles-update',
  templateUrl: './lesson-tiles-update.component.html',
})
export class LessonTilesUpdateComponent implements OnInit {
  isSaving = false;
  lessonTiles: ILessonTiles | null = null;

  lessonsSharedCollection: ILesson[] = [];
  tilesSharedCollection: ITile[] = [];

  editForm: LessonTilesFormGroup = this.lessonTilesFormService.createLessonTilesFormGroup();

  constructor(
    protected lessonTilesService: LessonTilesService,
    protected lessonTilesFormService: LessonTilesFormService,
    protected lessonService: LessonService,
    protected tileService: TileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLesson = (o1: ILesson | null, o2: ILesson | null): boolean => this.lessonService.compareLesson(o1, o2);

  compareTile = (o1: ITile | null, o2: ITile | null): boolean => this.tileService.compareTile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lessonTiles }) => {
      this.lessonTiles = lessonTiles;
      if (lessonTiles) {
        this.updateForm(lessonTiles);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lessonTiles = this.lessonTilesFormService.getLessonTiles(this.editForm);
    if (lessonTiles.id !== null) {
      this.subscribeToSaveResponse(this.lessonTilesService.update(lessonTiles));
    } else {
      this.subscribeToSaveResponse(this.lessonTilesService.create(lessonTiles));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILessonTiles>>): void {
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

  protected updateForm(lessonTiles: ILessonTiles): void {
    this.lessonTiles = lessonTiles;
    this.lessonTilesFormService.resetForm(this.editForm, lessonTiles);

    this.lessonsSharedCollection = this.lessonService.addLessonToCollectionIfMissing<ILesson>(
      this.lessonsSharedCollection,
      lessonTiles.lesson
    );
    this.tilesSharedCollection = this.tileService.addTileToCollectionIfMissing<ITile>(this.tilesSharedCollection, lessonTiles.tile);
  }

  protected loadRelationshipsOptions(): void {
    this.lessonService
      .query()
      .pipe(map((res: HttpResponse<ILesson[]>) => res.body ?? []))
      .pipe(map((lessons: ILesson[]) => this.lessonService.addLessonToCollectionIfMissing<ILesson>(lessons, this.lessonTiles?.lesson)))
      .subscribe((lessons: ILesson[]) => (this.lessonsSharedCollection = lessons));

    this.tileService
      .query()
      .pipe(map((res: HttpResponse<ITile[]>) => res.body ?? []))
      .pipe(map((tiles: ITile[]) => this.tileService.addTileToCollectionIfMissing<ITile>(tiles, this.lessonTiles?.tile)))
      .subscribe((tiles: ITile[]) => (this.tilesSharedCollection = tiles));
  }
}
