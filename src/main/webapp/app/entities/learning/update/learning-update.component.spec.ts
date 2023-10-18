import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LearningFormService } from './learning-form.service';
import { LearningService } from '../service/learning.service';
import { ILearning } from '../learning.model';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';

import { LearningUpdateComponent } from './learning-update.component';

describe('Learning Management Update Component', () => {
  let comp: LearningUpdateComponent;
  let fixture: ComponentFixture<LearningUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let learningFormService: LearningFormService;
  let learningService: LearningService;
  let lessonService: LessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LearningUpdateComponent],
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
      .overrideTemplate(LearningUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LearningUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    learningFormService = TestBed.inject(LearningFormService);
    learningService = TestBed.inject(LearningService);
    lessonService = TestBed.inject(LessonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lesson query and add missing value', () => {
      const learning: ILearning = { id: 456 };
      const lesson: ILesson = { id: 41644 };
      learning.lesson = lesson;

      const lessonCollection: ILesson[] = [{ id: 64943 }];
      jest.spyOn(lessonService, 'query').mockReturnValue(of(new HttpResponse({ body: lessonCollection })));
      const additionalLessons = [lesson];
      const expectedCollection: ILesson[] = [...additionalLessons, ...lessonCollection];
      jest.spyOn(lessonService, 'addLessonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ learning });
      comp.ngOnInit();

      expect(lessonService.query).toHaveBeenCalled();
      expect(lessonService.addLessonToCollectionIfMissing).toHaveBeenCalledWith(
        lessonCollection,
        ...additionalLessons.map(expect.objectContaining)
      );
      expect(comp.lessonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const learning: ILearning = { id: 456 };
      const lesson: ILesson = { id: 56469 };
      learning.lesson = lesson;

      activatedRoute.data = of({ learning });
      comp.ngOnInit();

      expect(comp.lessonsSharedCollection).toContain(lesson);
      expect(comp.learning).toEqual(learning);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearning>>();
      const learning = { id: 123 };
      jest.spyOn(learningFormService, 'getLearning').mockReturnValue(learning);
      jest.spyOn(learningService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learning });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learning }));
      saveSubject.complete();

      // THEN
      expect(learningFormService.getLearning).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(learningService.update).toHaveBeenCalledWith(expect.objectContaining(learning));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearning>>();
      const learning = { id: 123 };
      jest.spyOn(learningFormService, 'getLearning').mockReturnValue({ id: null });
      jest.spyOn(learningService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learning: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learning }));
      saveSubject.complete();

      // THEN
      expect(learningFormService.getLearning).toHaveBeenCalled();
      expect(learningService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearning>>();
      const learning = { id: 123 };
      jest.spyOn(learningService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learning });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(learningService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLesson', () => {
      it('Should forward to lessonService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(lessonService, 'compareLesson');
        comp.compareLesson(entity, entity2);
        expect(lessonService.compareLesson).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
