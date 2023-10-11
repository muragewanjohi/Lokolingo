import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILearning } from '../learning.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../learning.test-samples';

import { LearningService, RestLearning } from './learning.service';

const requireRestSample: RestLearning = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('Learning Service', () => {
  let service: LearningService;
  let httpMock: HttpTestingController;
  let expectedResult: ILearning | ILearning[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LearningService);
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

    it('should create a Learning', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const learning = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(learning).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Learning', () => {
      const learning = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(learning).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Learning', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Learning', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Learning', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLearningToCollectionIfMissing', () => {
      it('should add a Learning to an empty array', () => {
        const learning: ILearning = sampleWithRequiredData;
        expectedResult = service.addLearningToCollectionIfMissing([], learning);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(learning);
      });

      it('should not add a Learning to an array that contains it', () => {
        const learning: ILearning = sampleWithRequiredData;
        const learningCollection: ILearning[] = [
          {
            ...learning,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLearningToCollectionIfMissing(learningCollection, learning);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Learning to an array that doesn't contain it", () => {
        const learning: ILearning = sampleWithRequiredData;
        const learningCollection: ILearning[] = [sampleWithPartialData];
        expectedResult = service.addLearningToCollectionIfMissing(learningCollection, learning);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(learning);
      });

      it('should add only unique Learning to an array', () => {
        const learningArray: ILearning[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const learningCollection: ILearning[] = [sampleWithRequiredData];
        expectedResult = service.addLearningToCollectionIfMissing(learningCollection, ...learningArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const learning: ILearning = sampleWithRequiredData;
        const learning2: ILearning = sampleWithPartialData;
        expectedResult = service.addLearningToCollectionIfMissing([], learning, learning2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(learning);
        expect(expectedResult).toContain(learning2);
      });

      it('should accept null and undefined values', () => {
        const learning: ILearning = sampleWithRequiredData;
        expectedResult = service.addLearningToCollectionIfMissing([], null, learning, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(learning);
      });

      it('should return initial array if no Learning is added', () => {
        const learningCollection: ILearning[] = [sampleWithRequiredData];
        expectedResult = service.addLearningToCollectionIfMissing(learningCollection, undefined, null);
        expect(expectedResult).toEqual(learningCollection);
      });
    });

    describe('compareLearning', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLearning(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLearning(entity1, entity2);
        const compareResult2 = service.compareLearning(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLearning(entity1, entity2);
        const compareResult2 = service.compareLearning(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLearning(entity1, entity2);
        const compareResult2 = service.compareLearning(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
