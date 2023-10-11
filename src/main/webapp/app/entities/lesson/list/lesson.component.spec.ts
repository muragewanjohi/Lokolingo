import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LessonService } from '../service/lesson.service';

import { LessonComponent } from './lesson.component';

describe('Lesson Management Component', () => {
  let comp: LessonComponent;
  let fixture: ComponentFixture<LessonComponent>;
  let service: LessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'lesson', component: LessonComponent }]), HttpClientTestingModule],
      declarations: [LessonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LessonComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LessonComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LessonService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.lessons?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to lessonService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLessonIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLessonIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
