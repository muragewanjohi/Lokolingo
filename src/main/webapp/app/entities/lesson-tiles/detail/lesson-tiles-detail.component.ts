import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILessonTiles } from '../lesson-tiles.model';

@Component({
  selector: 'jhi-lesson-tiles-detail',
  templateUrl: './lesson-tiles-detail.component.html',
})
export class LessonTilesDetailComponent implements OnInit {
  lessonTiles: ILessonTiles | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lessonTiles }) => {
      this.lessonTiles = lessonTiles;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
