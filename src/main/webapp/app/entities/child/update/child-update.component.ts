import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChildFormService, ChildFormGroup } from './child-form.service';
import { IChild } from '../child.model';
import { ChildService } from '../service/child.service';
import { IParent } from 'app/entities/parent/parent.model';
import { ParentService } from 'app/entities/parent/service/parent.service';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-child-update',
  templateUrl: './child-update.component.html',
})
export class ChildUpdateComponent implements OnInit {
  isSaving = false;
  child: IChild | null = null;
  genderValues = Object.keys(Gender);

  parentsSharedCollection: IParent[] = [];

  editForm: ChildFormGroup = this.childFormService.createChildFormGroup();

  constructor(
    protected childService: ChildService,
    protected childFormService: ChildFormService,
    protected parentService: ParentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParent = (o1: IParent | null, o2: IParent | null): boolean => this.parentService.compareParent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ child }) => {
      this.child = child;
      if (child) {
        this.updateForm(child);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const child = this.childFormService.getChild(this.editForm);
    if (child.id !== null) {
      this.subscribeToSaveResponse(this.childService.update(child));
    } else {
      this.subscribeToSaveResponse(this.childService.create(child));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChild>>): void {
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

  protected updateForm(child: IChild): void {
    this.child = child;
    this.childFormService.resetForm(this.editForm, child);

    this.parentsSharedCollection = this.parentService.addParentToCollectionIfMissing<IParent>(this.parentsSharedCollection, child.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.parentService
      .query()
      .pipe(map((res: HttpResponse<IParent[]>) => res.body ?? []))
      .pipe(map((parents: IParent[]) => this.parentService.addParentToCollectionIfMissing<IParent>(parents, this.child?.parent)))
      .subscribe((parents: IParent[]) => (this.parentsSharedCollection = parents));
  }
}
