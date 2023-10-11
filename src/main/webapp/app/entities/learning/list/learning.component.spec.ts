import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LearningService } from '../service/learning.service';

import { LearningComponent } from './learning.component';

describe('Learning Management Component', () => {
  let comp: LearningComponent;
  let fixture: ComponentFixture<LearningComponent>;
  let service: LearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'learning', component: LearningComponent }]), HttpClientTestingModule],
      declarations: [LearningComponent],
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
      .overrideTemplate(LearningComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LearningComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LearningService);

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
    expect(comp.learnings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to learningService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLearningIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLearningIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
