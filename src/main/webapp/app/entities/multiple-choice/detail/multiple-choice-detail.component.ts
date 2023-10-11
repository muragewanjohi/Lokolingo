import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMultipleChoice } from '../multiple-choice.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-multiple-choice-detail',
  templateUrl: './multiple-choice-detail.component.html',
})
export class MultipleChoiceDetailComponent implements OnInit {
  multipleChoice: IMultipleChoice | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ multipleChoice }) => {
      this.multipleChoice = multipleChoice;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
