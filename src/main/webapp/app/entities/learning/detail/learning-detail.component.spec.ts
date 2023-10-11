import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LearningDetailComponent } from './learning-detail.component';

describe('Learning Management Detail Component', () => {
  let comp: LearningDetailComponent;
  let fixture: ComponentFixture<LearningDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ learning: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LearningDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LearningDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load learning on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.learning).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
