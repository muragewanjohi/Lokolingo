import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MultipleChoiceFormService } from './multiple-choice-form.service';
import { MultipleChoiceService } from '../service/multiple-choice.service';
import { IMultipleChoice } from '../multiple-choice.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { MultipleChoiceUpdateComponent } from './multiple-choice-update.component';

describe('MultipleChoice Management Update Component', () => {
  let comp: MultipleChoiceUpdateComponent;
  let fixture: ComponentFixture<MultipleChoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let multipleChoiceFormService: MultipleChoiceFormService;
  let multipleChoiceService: MultipleChoiceService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MultipleChoiceUpdateComponent],
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
      .overrideTemplate(MultipleChoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    multipleChoiceFormService = TestBed.inject(MultipleChoiceFormService);
    multipleChoiceService = TestBed.inject(MultipleChoiceService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const multipleChoice: IMultipleChoice = { id: 456 };
      const question: IQuestion = { id: 12789 };
      multipleChoice.question = question;

      const questionCollection: IQuestion[] = [{ id: 24037 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ multipleChoice });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(
        questionCollection,
        ...additionalQuestions.map(expect.objectContaining)
      );
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const multipleChoice: IMultipleChoice = { id: 456 };
      const question: IQuestion = { id: 77381 };
      multipleChoice.question = question;

      activatedRoute.data = of({ multipleChoice });
      comp.ngOnInit();

      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.multipleChoice).toEqual(multipleChoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMultipleChoice>>();
      const multipleChoice = { id: 123 };
      jest.spyOn(multipleChoiceFormService, 'getMultipleChoice').mockReturnValue(multipleChoice);
      jest.spyOn(multipleChoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ multipleChoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: multipleChoice }));
      saveSubject.complete();

      // THEN
      expect(multipleChoiceFormService.getMultipleChoice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(multipleChoiceService.update).toHaveBeenCalledWith(expect.objectContaining(multipleChoice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMultipleChoice>>();
      const multipleChoice = { id: 123 };
      jest.spyOn(multipleChoiceFormService, 'getMultipleChoice').mockReturnValue({ id: null });
      jest.spyOn(multipleChoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ multipleChoice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: multipleChoice }));
      saveSubject.complete();

      // THEN
      expect(multipleChoiceFormService.getMultipleChoice).toHaveBeenCalled();
      expect(multipleChoiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMultipleChoice>>();
      const multipleChoice = { id: 123 };
      jest.spyOn(multipleChoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ multipleChoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(multipleChoiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareQuestion', () => {
      it('Should forward to questionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(questionService, 'compareQuestion');
        comp.compareQuestion(entity, entity2);
        expect(questionService.compareQuestion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
