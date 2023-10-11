import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChild } from '../child.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../child.test-samples';

import { ChildService } from './child.service';

const requireRestSample: IChild = {
  ...sampleWithRequiredData,
};

describe('Child Service', () => {
  let service: ChildService;
  let httpMock: HttpTestingController;
  let expectedResult: IChild | IChild[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChildService);
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

    it('should create a Child', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const child = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(child).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Child', () => {
      const child = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(child).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Child', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Child', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Child', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChildToCollectionIfMissing', () => {
      it('should add a Child to an empty array', () => {
        const child: IChild = sampleWithRequiredData;
        expectedResult = service.addChildToCollectionIfMissing([], child);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(child);
      });

      it('should not add a Child to an array that contains it', () => {
        const child: IChild = sampleWithRequiredData;
        const childCollection: IChild[] = [
          {
            ...child,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, child);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Child to an array that doesn't contain it", () => {
        const child: IChild = sampleWithRequiredData;
        const childCollection: IChild[] = [sampleWithPartialData];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, child);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(child);
      });

      it('should add only unique Child to an array', () => {
        const childArray: IChild[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const childCollection: IChild[] = [sampleWithRequiredData];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, ...childArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const child: IChild = sampleWithRequiredData;
        const child2: IChild = sampleWithPartialData;
        expectedResult = service.addChildToCollectionIfMissing([], child, child2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(child);
        expect(expectedResult).toContain(child2);
      });

      it('should accept null and undefined values', () => {
        const child: IChild = sampleWithRequiredData;
        expectedResult = service.addChildToCollectionIfMissing([], null, child, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(child);
      });

      it('should return initial array if no Child is added', () => {
        const childCollection: IChild[] = [sampleWithRequiredData];
        expectedResult = service.addChildToCollectionIfMissing(childCollection, undefined, null);
        expect(expectedResult).toEqual(childCollection);
      });
    });

    describe('compareChild', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChild(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChild(entity1, entity2);
        const compareResult2 = service.compareChild(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChild(entity1, entity2);
        const compareResult2 = service.compareChild(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChild(entity1, entity2);
        const compareResult2 = service.compareChild(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
