import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SubjectLessonsFormService } from './subject-lessons-form.service';
import { SubjectLessonsService } from '../service/subject-lessons.service';
import { ISubjectLessons } from '../subject-lessons.model';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';

import { SubjectLessonsUpdateComponent } from './subject-lessons-update.component';

describe('SubjectLessons Management Update Component', () => {
  let comp: SubjectLessonsUpdateComponent;
  let fixture: ComponentFixture<SubjectLessonsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subjectLessonsFormService: SubjectLessonsFormService;
  let subjectLessonsService: SubjectLessonsService;
  let subjectService: SubjectService;
  let lessonService: LessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SubjectLessonsUpdateComponent],
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
      .overrideTemplate(SubjectLessonsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubjectLessonsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subjectLessonsFormService = TestBed.inject(SubjectLessonsFormService);
    subjectLessonsService = TestBed.inject(SubjectLessonsService);
    subjectService = TestBed.inject(SubjectService);
    lessonService = TestBed.inject(LessonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Subject query and add missing value', () => {
      const subjectLessons: ISubjectLessons = { id: 456 };
      const subject: ISubject = { id: 37153 };
      subjectLessons.subject = subject;

      const subjectCollection: ISubject[] = [{ id: 22810 }];
      jest.spyOn(subjectService, 'query').mockReturnValue(of(new HttpResponse({ body: subjectCollection })));
      const additionalSubjects = [subject];
      const expectedCollection: ISubject[] = [...additionalSubjects, ...subjectCollection];
      jest.spyOn(subjectService, 'addSubjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subjectLessons });
      comp.ngOnInit();

      expect(subjectService.query).toHaveBeenCalled();
      expect(subjectService.addSubjectToCollectionIfMissing).toHaveBeenCalledWith(
        subjectCollection,
        ...additionalSubjects.map(expect.objectContaining)
      );
      expect(comp.subjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Lesson query and add missing value', () => {
      const subjectLessons: ISubjectLessons = { id: 456 };
      const lesson: ILesson = { id: 41083 };
      subjectLessons.lesson = lesson;

      const lessonCollection: ILesson[] = [{ id: 76063 }];
      jest.spyOn(lessonService, 'query').mockReturnValue(of(new HttpResponse({ body: lessonCollection })));
      const additionalLessons = [lesson];
      const expectedCollection: ILesson[] = [...additionalLessons, ...lessonCollection];
      jest.spyOn(lessonService, 'addLessonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subjectLessons });
      comp.ngOnInit();

      expect(lessonService.query).toHaveBeenCalled();
      expect(lessonService.addLessonToCollectionIfMissing).toHaveBeenCalledWith(
        lessonCollection,
        ...additionalLessons.map(expect.objectContaining)
      );
      expect(comp.lessonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const subjectLessons: ISubjectLessons = { id: 456 };
      const subject: ISubject = { id: 80541 };
      subjectLessons.subject = subject;
      const lesson: ILesson = { id: 21975 };
      subjectLessons.lesson = lesson;

      activatedRoute.data = of({ subjectLessons });
      comp.ngOnInit();

      expect(comp.subjectsSharedCollection).toContain(subject);
      expect(comp.lessonsSharedCollection).toContain(lesson);
      expect(comp.subjectLessons).toEqual(subjectLessons);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectLessons>>();
      const subjectLessons = { id: 123 };
      jest.spyOn(subjectLessonsFormService, 'getSubjectLessons').mockReturnValue(subjectLessons);
      jest.spyOn(subjectLessonsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectLessons });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjectLessons }));
      saveSubject.complete();

      // THEN
      expect(subjectLessonsFormService.getSubjectLessons).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subjectLessonsService.update).toHaveBeenCalledWith(expect.objectContaining(subjectLessons));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectLessons>>();
      const subjectLessons = { id: 123 };
      jest.spyOn(subjectLessonsFormService, 'getSubjectLessons').mockReturnValue({ id: null });
      jest.spyOn(subjectLessonsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectLessons: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjectLessons }));
      saveSubject.complete();

      // THEN
      expect(subjectLessonsFormService.getSubjectLessons).toHaveBeenCalled();
      expect(subjectLessonsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectLessons>>();
      const subjectLessons = { id: 123 };
      jest.spyOn(subjectLessonsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectLessons });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subjectLessonsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSubject', () => {
      it('Should forward to subjectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(subjectService, 'compareSubject');
        comp.compareSubject(entity, entity2);
        expect(subjectService.compareSubject).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
