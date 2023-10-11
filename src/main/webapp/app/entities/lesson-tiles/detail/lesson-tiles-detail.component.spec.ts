import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LessonTilesDetailComponent } from './lesson-tiles-detail.component';

describe('LessonTiles Management Detail Component', () => {
  let comp: LessonTilesDetailComponent;
  let fixture: ComponentFixture<LessonTilesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonTilesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lessonTiles: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LessonTilesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LessonTilesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lessonTiles on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lessonTiles).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
