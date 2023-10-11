import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MultipleChoiceService } from '../service/multiple-choice.service';

import { MultipleChoiceComponent } from './multiple-choice.component';

describe('MultipleChoice Management Component', () => {
  let comp: MultipleChoiceComponent;
  let fixture: ComponentFixture<MultipleChoiceComponent>;
  let service: MultipleChoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'multiple-choice', component: MultipleChoiceComponent }]), HttpClientTestingModule],
      declarations: [MultipleChoiceComponent],
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
      .overrideTemplate(MultipleChoiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MultipleChoiceService);

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
    expect(comp.multipleChoices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to multipleChoiceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMultipleChoiceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMultipleChoiceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
