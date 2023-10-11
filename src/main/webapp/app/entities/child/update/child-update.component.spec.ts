import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChildFormService } from './child-form.service';
import { ChildService } from '../service/child.service';
import { IChild } from '../child.model';
import { IParent } from 'app/entities/parent/parent.model';
import { ParentService } from 'app/entities/parent/service/parent.service';

import { ChildUpdateComponent } from './child-update.component';

describe('Child Management Update Component', () => {
  let comp: ChildUpdateComponent;
  let fixture: ComponentFixture<ChildUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let childFormService: ChildFormService;
  let childService: ChildService;
  let parentService: ParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChildUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChildUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChildUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    childFormService = TestBed.inject(ChildFormService);
    childService = TestBed.inject(ChildService);
    parentService = TestBed.inject(ParentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Parent query and add missing value', () => {
      const child: IChild = { id: 456 };
      const parent: IParent = { id: 80819 };
      child.parent = parent;

      const parentCollection: IParent[] = [{ id: 1466 }];
      jest.spyOn(parentService, 'query').mockReturnValue(of(new HttpResponse({ body: parentCollection })));
      const additionalParents = [parent];
      const expectedCollection: IParent[] = [...additionalParents, ...parentCollection];
      jest.spyOn(parentService, 'addParentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ child });
      comp.ngOnInit();

      expect(parentService.query).toHaveBeenCalled();
      expect(parentService.addParentToCollectionIfMissing).toHaveBeenCalledWith(
        parentCollection,
        ...additionalParents.map(expect.objectContaining)
      );
      expect(comp.parentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const child: IChild = { id: 456 };
      const parent: IParent = { id: 77172 };
      child.parent = parent;

      activatedRoute.data = of({ child });
      comp.ngOnInit();

      expect(comp.parentsSharedCollection).toContain(parent);
      expect(comp.child).toEqual(child);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChild>>();
      const child = { id: 123 };
      jest.spyOn(childFormService, 'getChild').mockReturnValue(child);
      jest.spyOn(childService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: child }));
      saveSubject.complete();

      // THEN
      expect(childFormService.getChild).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(childService.update).toHaveBeenCalledWith(expect.objectContaining(child));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChild>>();
      const child = { id: 123 };
      jest.spyOn(childFormService, 'getChild').mockReturnValue({ id: null });
      jest.spyOn(childService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: child }));
      saveSubject.complete();

      // THEN
      expect(childFormService.getChild).toHaveBeenCalled();
      expect(childService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChild>>();
      const child = { id: 123 };
      jest.spyOn(childService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ child });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(childService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParent', () => {
      it('Should forward to parentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(parentService, 'compareParent');
        comp.compareParent(entity, entity2);
        expect(parentService.compareParent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
