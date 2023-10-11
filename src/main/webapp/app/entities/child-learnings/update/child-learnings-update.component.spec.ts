import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChildLearningsFormService } from './child-learnings-form.service';
import { ChildLearningsService } from '../service/child-learnings.service';
import { IChildLearnings } from '../child-learnings.model';
import { IChild } from 'app/entities/child/child.model';
import { ChildService } from 'app/entities/child/service/child.service';
import { ILearning } from 'app/entities/learning/learning.model';
import { LearningService } from 'app/entities/learning/service/learning.service';

import { ChildLearningsUpdateComponent } from './child-learnings-update.component';

describe('ChildLearnings Management Update Component', () => {
  let comp: ChildLearningsUpdateComponent;
  let fixture: ComponentFixture<ChildLearningsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let childLearningsFormService: ChildLearningsFormService;
  let childLearningsService: ChildLearningsService;
  let childService: ChildService;
  let learningService: LearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChildLearningsUpdateComponent],
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
      .overrideTemplate(ChildLearningsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChildLearningsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    childLearningsFormService = TestBed.inject(ChildLearningsFormService);
    childLearningsService = TestBed.inject(ChildLearningsService);
    childService = TestBed.inject(ChildService);
    learningService = TestBed.inject(LearningService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Child query and add missing value', () => {
      const childLearnings: IChildLearnings = { id: 456 };
      const child: IChild = { id: 84726 };
      childLearnings.child = child;

      const childCollection: IChild[] = [{ id: 60388 }];
      jest.spyOn(childService, 'query').mockReturnValue(of(new HttpResponse({ body: childCollection })));
      const additionalChildren = [child];
      const expectedCollection: IChild[] = [...additionalChildren, ...childCollection];
      jest.spyOn(childService, 'addChildToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ childLearnings });
      comp.ngOnInit();

      expect(childService.query).toHaveBeenCalled();
      expect(childService.addChildToCollectionIfMissing).toHaveBeenCalledWith(
        childCollection,
        ...additionalChildren.map(expect.objectContaining)
      );
      expect(comp.childrenSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Learning query and add missing value', () => {
      const childLearnings: IChildLearnings = { id: 456 };
      const learning: ILearning = { id: 71980 };
      childLearnings.learning = learning;

      const learningCollection: ILearning[] = [{ id: 24827 }];
      jest.spyOn(learningService, 'query').mockReturnValue(of(new HttpResponse({ body: learningCollection })));
      const additionalLearnings = [learning];
      const expectedCollection: ILearning[] = [...additionalLearnings, ...learningCollection];
      jest.spyOn(learningService, 'addLearningToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ childLearnings });
      comp.ngOnInit();

      expect(learningService.query).toHaveBeenCalled();
      expect(learningService.addLearningToCollectionIfMissing).toHaveBeenCalledWith(
        learningCollection,
        ...additionalLearnings.map(expect.objectContaining)
      );
      expect(comp.learningsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const childLearnings: IChildLearnings = { id: 456 };
      const child: IChild = { id: 86082 };
      childLearnings.child = child;
      const learning: ILearning = { id: 5882 };
      childLearnings.learning = learning;

      activatedRoute.data = of({ childLearnings });
      comp.ngOnInit();

      expect(comp.childrenSharedCollection).toContain(child);
      expect(comp.learningsSharedCollection).toContain(learning);
      expect(comp.childLearnings).toEqual(childLearnings);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChildLearnings>>();
      const childLearnings = { id: 123 };
      jest.spyOn(childLearningsFormService, 'getChildLearnings').mockReturnValue(childLearnings);
      jest.spyOn(childLearningsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ childLearnings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: childLearnings }));
      saveSubject.complete();

      // THEN
      expect(childLearningsFormService.getChildLearnings).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(childLearningsService.update).toHaveBeenCalledWith(expect.objectContaining(childLearnings));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChildLearnings>>();
      const childLearnings = { id: 123 };
      jest.spyOn(childLearningsFormService, 'getChildLearnings').mockReturnValue({ id: null });
      jest.spyOn(childLearningsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ childLearnings: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: childLearnings }));
      saveSubject.complete();

      // THEN
      expect(childLearningsFormService.getChildLearnings).toHaveBeenCalled();
      expect(childLearningsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChildLearnings>>();
      const childLearnings = { id: 123 };
      jest.spyOn(childLearningsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ childLearnings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(childLearningsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareChild', () => {
      it('Should forward to childService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(childService, 'compareChild');
        comp.compareChild(entity, entity2);
        expect(childService.compareChild).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLearning', () => {
      it('Should forward to learningService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(learningService, 'compareLearning');
        comp.compareLearning(entity, entity2);
        expect(learningService.compareLearning).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
