import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LessonFormService } from './lesson-form.service';
import { LessonService } from '../service/lesson.service';
import { ILesson } from '../lesson.model';

import { LessonUpdateComponent } from './lesson-update.component';

describe('Lesson Management Update Component', () => {
  let comp: LessonUpdateComponent;
  let fixture: ComponentFixture<LessonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lessonFormService: LessonFormService;
  let lessonService: LessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LessonUpdateComponent],
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
      .overrideTemplate(LessonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LessonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lessonFormService = TestBed.inject(LessonFormService);
    lessonService = TestBed.inject(LessonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const lesson: ILesson = { id: 456 };

      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      expect(comp.lesson).toEqual(lesson);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonFormService, 'getLesson').mockReturnValue(lesson);
      jest.spyOn(lessonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lesson }));
      saveSubject.complete();

      // THEN
      expect(lessonFormService.getLesson).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lessonService.update).toHaveBeenCalledWith(expect.objectContaining(lesson));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonFormService, 'getLesson').mockReturnValue({ id: null });
      jest.spyOn(lessonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lesson }));
      saveSubject.complete();

      // THEN
      expect(lessonFormService.getLesson).toHaveBeenCalled();
      expect(lessonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lessonService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
