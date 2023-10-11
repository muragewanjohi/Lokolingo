import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubjectLessonsDetailComponent } from './subject-lessons-detail.component';

describe('SubjectLessons Management Detail Component', () => {
  let comp: SubjectLessonsDetailComponent;
  let fixture: ComponentFixture<SubjectLessonsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectLessonsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ subjectLessons: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SubjectLessonsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SubjectLessonsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subjectLessons on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.subjectLessons).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
