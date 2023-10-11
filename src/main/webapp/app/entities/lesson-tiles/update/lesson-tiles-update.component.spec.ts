import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LessonTilesFormService } from './lesson-tiles-form.service';
import { LessonTilesService } from '../service/lesson-tiles.service';
import { ILessonTiles } from '../lesson-tiles.model';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { LessonService } from 'app/entities/lesson/service/lesson.service';
import { ITile } from 'app/entities/tile/tile.model';
import { TileService } from 'app/entities/tile/service/tile.service';

import { LessonTilesUpdateComponent } from './lesson-tiles-update.component';

describe('LessonTiles Management Update Component', () => {
  let comp: LessonTilesUpdateComponent;
  let fixture: ComponentFixture<LessonTilesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lessonTilesFormService: LessonTilesFormService;
  let lessonTilesService: LessonTilesService;
  let lessonService: LessonService;
  let tileService: TileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LessonTilesUpdateComponent],
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
      .overrideTemplate(LessonTilesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LessonTilesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lessonTilesFormService = TestBed.inject(LessonTilesFormService);
    lessonTilesService = TestBed.inject(LessonTilesService);
    lessonService = TestBed.inject(LessonService);
    tileService = TestBed.inject(TileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lesson query and add missing value', () => {
      const lessonTiles: ILessonTiles = { id: 456 };
      const lesson: ILesson = { id: 50892 };
      lessonTiles.lesson = lesson;

      const lessonCollection: ILesson[] = [{ id: 52753 }];
      jest.spyOn(lessonService, 'query').mockReturnValue(of(new HttpResponse({ body: lessonCollection })));
      const additionalLessons = [lesson];
      const expectedCollection: ILesson[] = [...additionalLessons, ...lessonCollection];
      jest.spyOn(lessonService, 'addLessonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lessonTiles });
      comp.ngOnInit();

      expect(lessonService.query).toHaveBeenCalled();
      expect(lessonService.addLessonToCollectionIfMissing).toHaveBeenCalledWith(
        lessonCollection,
        ...additionalLessons.map(expect.objectContaining)
      );
      expect(comp.lessonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tile query and add missing value', () => {
      const lessonTiles: ILessonTiles = { id: 456 };
      const tile: ITile = { id: 86031 };
      lessonTiles.tile = tile;

      const tileCollection: ITile[] = [{ id: 95997 }];
      jest.spyOn(tileService, 'query').mockReturnValue(of(new HttpResponse({ body: tileCollection })));
      const additionalTiles = [tile];
      const expectedCollection: ITile[] = [...additionalTiles, ...tileCollection];
      jest.spyOn(tileService, 'addTileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lessonTiles });
      comp.ngOnInit();

      expect(tileService.query).toHaveBeenCalled();
      expect(tileService.addTileToCollectionIfMissing).toHaveBeenCalledWith(
        tileCollection,
        ...additionalTiles.map(expect.objectContaining)
      );
      expect(comp.tilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lessonTiles: ILessonTiles = { id: 456 };
      const lesson: ILesson = { id: 3737 };
      lessonTiles.lesson = lesson;
      const tile: ITile = { id: 1807 };
      lessonTiles.tile = tile;

      activatedRoute.data = of({ lessonTiles });
      comp.ngOnInit();

      expect(comp.lessonsSharedCollection).toContain(lesson);
      expect(comp.tilesSharedCollection).toContain(tile);
      expect(comp.lessonTiles).toEqual(lessonTiles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILessonTiles>>();
      const lessonTiles = { id: 123 };
      jest.spyOn(lessonTilesFormService, 'getLessonTiles').mockReturnValue(lessonTiles);
      jest.spyOn(lessonTilesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lessonTiles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lessonTiles }));
      saveSubject.complete();

      // THEN
      expect(lessonTilesFormService.getLessonTiles).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lessonTilesService.update).toHaveBeenCalledWith(expect.objectContaining(lessonTiles));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILessonTiles>>();
      const lessonTiles = { id: 123 };
      jest.spyOn(lessonTilesFormService, 'getLessonTiles').mockReturnValue({ id: null });
      jest.spyOn(lessonTilesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lessonTiles: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lessonTiles }));
      saveSubject.complete();

      // THEN
      expect(lessonTilesFormService.getLessonTiles).toHaveBeenCalled();
      expect(lessonTilesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILessonTiles>>();
      const lessonTiles = { id: 123 };
      jest.spyOn(lessonTilesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lessonTiles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lessonTilesService.update).toHaveBeenCalled();
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

    describe('compareTile', () => {
      it('Should forward to tileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tileService, 'compareTile');
        comp.compareTile(entity, entity2);
        expect(tileService.compareTile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
