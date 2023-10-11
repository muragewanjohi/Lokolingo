import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILearning } from '../learning.model';

@Component({
  selector: 'jhi-learning-detail',
  templateUrl: './learning-detail.component.html',
})
export class LearningDetailComponent implements OnInit {
  learning: ILearning | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ learning }) => {
      this.learning = learning;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
