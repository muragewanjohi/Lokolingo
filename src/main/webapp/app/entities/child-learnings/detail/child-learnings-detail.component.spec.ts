import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChildLearningsDetailComponent } from './child-learnings-detail.component';

describe('ChildLearnings Management Detail Component', () => {
  let comp: ChildLearningsDetailComponent;
  let fixture: ComponentFixture<ChildLearningsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildLearningsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ childLearnings: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChildLearningsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChildLearningsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load childLearnings on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.childLearnings).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
