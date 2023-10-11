import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TileFormService } from './tile-form.service';
import { TileService } from '../service/tile.service';
import { ITile } from '../tile.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { TileUpdateComponent } from './tile-update.component';

describe('Tile Management Update Component', () => {
  let comp: TileUpdateComponent;
  let fixture: ComponentFixture<TileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tileFormService: TileFormService;
  let tileService: TileService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TileUpdateComponent],
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
      .overrideTemplate(TileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tileFormService = TestBed.inject(TileFormService);
    tileService = TestBed.inject(TileService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const tile: ITile = { id: 456 };
      const question: IQuestion = { id: 96980 };
      tile.question = question;

      const questionCollection: IQuestion[] = [{ id: 1591 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tile });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(
        questionCollection,
        ...additionalQuestions.map(expect.objectContaining)
      );
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tile: ITile = { id: 456 };
      const question: IQuestion = { id: 75389 };
      tile.question = question;

      activatedRoute.data = of({ tile });
      comp.ngOnInit();

      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.tile).toEqual(tile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITile>>();
      const tile = { id: 123 };
      jest.spyOn(tileFormService, 'getTile').mockReturnValue(tile);
      jest.spyOn(tileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tile }));
      saveSubject.complete();

      // THEN
      expect(tileFormService.getTile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tileService.update).toHaveBeenCalledWith(expect.objectContaining(tile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITile>>();
      const tile = { id: 123 };
      jest.spyOn(tileFormService, 'getTile').mockReturnValue({ id: null });
      jest.spyOn(tileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tile }));
      saveSubject.complete();

      // THEN
      expect(tileFormService.getTile).toHaveBeenCalled();
      expect(tileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITile>>();
      const tile = { id: 123 };
      jest.spyOn(tileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tileService.update).toHaveBeenCalled();
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
