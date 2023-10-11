import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISubjectLessons } from '../subject-lessons.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../subject-lessons.test-samples';

import { SubjectLessonsService, RestSubjectLessons } from './subject-lessons.service';

const requireRestSample: RestSubjectLessons = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('SubjectLessons Service', () => {
  let service: SubjectLessonsService;
  let httpMock: HttpTestingController;
  let expectedResult: ISubjectLessons | ISubjectLessons[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SubjectLessonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SubjectLessons', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const subjectLessons = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(subjectLessons).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubjectLessons', () => {
      const subjectLessons = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(subjectLessons).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubjectLessons', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubjectLessons', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SubjectLessons', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSubjectLessonsToCollectionIfMissing', () => {
      it('should add a SubjectLessons to an empty array', () => {
        const subjectLessons: ISubjectLessons = sampleWithRequiredData;
        expectedResult = service.addSubjectLessonsToCollectionIfMissing([], subjectLessons);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjectLessons);
      });

      it('should not add a SubjectLessons to an array that contains it', () => {
        const subjectLessons: ISubjectLessons = sampleWithRequiredData;
        const subjectLessonsCollection: ISubjectLessons[] = [
          {
            ...subjectLessons,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSubjectLessonsToCollectionIfMissing(subjectLessonsCollection, subjectLessons);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubjectLessons to an array that doesn't contain it", () => {
        const subjectLessons: ISubjectLessons = sampleWithRequiredData;
        const subjectLessonsCollection: ISubjectLessons[] = [sampleWithPartialData];
        expectedResult = service.addSubjectLessonsToCollectionIfMissing(subjectLessonsCollection, subjectLessons);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjectLessons);
      });

      it('should add only unique SubjectLessons to an array', () => {
        const subjectLessonsArray: ISubjectLessons[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const subjectLessonsCollection: ISubjectLessons[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectLessonsToCollectionIfMissing(subjectLessonsCollection, ...subjectLessonsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subjectLessons: ISubjectLessons = sampleWithRequiredData;
        const subjectLessons2: ISubjectLessons = sampleWithPartialData;
        expectedResult = service.addSubjectLessonsToCollectionIfMissing([], subjectLessons, subjectLessons2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjectLessons);
        expect(expectedResult).toContain(subjectLessons2);
      });

      it('should accept null and undefined values', () => {
        const subjectLessons: ISubjectLessons = sampleWithRequiredData;
        expectedResult = service.addSubjectLessonsToCollectionIfMissing([], null, subjectLessons, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjectLessons);
      });

      it('should return initial array if no SubjectLessons is added', () => {
        const subjectLessonsCollection: ISubjectLessons[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectLessonsToCollectionIfMissing(subjectLessonsCollection, undefined, null);
        expect(expectedResult).toEqual(subjectLessonsCollection);
      });
    });

    describe('compareSubjectLessons', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSubjectLessons(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSubjectLessons(entity1, entity2);
        const compareResult2 = service.compareSubjectLessons(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSubjectLessons(entity1, entity2);
        const compareResult2 = service.compareSubjectLessons(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSubjectLessons(entity1, entity2);
        const compareResult2 = service.compareSubjectLessons(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
