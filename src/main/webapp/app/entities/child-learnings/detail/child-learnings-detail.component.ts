import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChildLearnings } from '../child-learnings.model';

@Component({
  selector: 'jhi-child-learnings-detail',
  templateUrl: './child-learnings-detail.component.html',
})
export class ChildLearningsDetailComponent implements OnInit {
  childLearnings: IChildLearnings | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ childLearnings }) => {
      this.childLearnings = childLearnings;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
