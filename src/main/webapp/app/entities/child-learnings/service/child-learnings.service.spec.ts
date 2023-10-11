import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChildLearnings } from '../child-learnings.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../child-learnings.test-samples';

import { ChildLearningsService, RestChildLearnings } from './child-learnings.service';

const requireRestSample: RestChildLearnings = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('ChildLearnings Service', () => {
  let service: ChildLearningsService;
  let httpMock: HttpTestingController;
  let expectedResult: IChildLearnings | IChildLearnings[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChildLearningsService);
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

    it('should create a ChildLearnings', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const childLearnings = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(childLearnings).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChildLearnings', () => {
      const childLearnings = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(childLearnings).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChildLearnings', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChildLearnings', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ChildLearnings', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChildLearningsToCollectionIfMissing', () => {
      it('should add a ChildLearnings to an empty array', () => {
        const childLearnings: IChildLearnings = sampleWithRequiredData;
        expectedResult = service.addChildLearningsToCollectionIfMissing([], childLearnings);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(childLearnings);
      });

      it('should not add a ChildLearnings to an array that contains it', () => {
        const childLearnings: IChildLearnings = sampleWithRequiredData;
        const childLearningsCollection: IChildLearnings[] = [
          {
            ...childLearnings,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChildLearningsToCollectionIfMissing(childLearningsCollection, childLearnings);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChildLearnings to an array that doesn't contain it", () => {
        const childLearnings: IChildLearnings = sampleWithRequiredData;
        const childLearningsCollection: IChildLearnings[] = [sampleWithPartialData];
        expectedResult = service.addChildLearningsToCollectionIfMissing(childLearningsCollection, childLearnings);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(childLearnings);
      });

      it('should add only unique ChildLearnings to an array', () => {
        const childLearningsArray: IChildLearnings[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const childLearningsCollection: IChildLearnings[] = [sampleWithRequiredData];
        expectedResult = service.addChildLearningsToCollectionIfMissing(childLearningsCollection, ...childLearningsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const childLearnings: IChildLearnings = sampleWithRequiredData;
        const childLearnings2: IChildLearnings = sampleWithPartialData;
        expectedResult = service.addChildLearningsToCollectionIfMissing([], childLearnings, childLearnings2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(childLearnings);
        expect(expectedResult).toContain(childLearnings2);
      });

      it('should accept null and undefined values', () => {
        const childLearnings: IChildLearnings = sampleWithRequiredData;
        expectedResult = service.addChildLearningsToCollectionIfMissing([], null, childLearnings, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(childLearnings);
      });

      it('should return initial array if no ChildLearnings is added', () => {
        const childLearningsCollection: IChildLearnings[] = [sampleWithRequiredData];
        expectedResult = service.addChildLearningsToCollectionIfMissing(childLearningsCollection, undefined, null);
        expect(expectedResult).toEqual(childLearningsCollection);
      });
    });

    describe('compareChildLearnings', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChildLearnings(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChildLearnings(entity1, entity2);
        const compareResult2 = service.compareChildLearnings(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChildLearnings(entity1, entity2);
        const compareResult2 = service.compareChildLearnings(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChildLearnings(entity1, entity2);
        const compareResult2 = service.compareChildLearnings(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
