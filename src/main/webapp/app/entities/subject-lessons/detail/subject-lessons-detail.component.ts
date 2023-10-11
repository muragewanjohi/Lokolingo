import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubjectLessons } from '../subject-lessons.model';

@Component({
  selector: 'jhi-subject-lessons-detail',
  templateUrl: './subject-lessons-detail.component.html',
})
export class SubjectLessonsDetailComponent implements OnInit {
  subjectLessons: ISubjectLessons | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjectLessons }) => {
      this.subjectLessons = subjectLessons;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
