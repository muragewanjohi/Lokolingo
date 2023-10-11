import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILessonTiles } from '../lesson-tiles.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lesson-tiles.test-samples';

import { LessonTilesService, RestLessonTiles } from './lesson-tiles.service';

const requireRestSample: RestLessonTiles = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('LessonTiles Service', () => {
  let service: LessonTilesService;
  let httpMock: HttpTestingController;
  let expectedResult: ILessonTiles | ILessonTiles[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LessonTilesService);
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

    it('should create a LessonTiles', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lessonTiles = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lessonTiles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LessonTiles', () => {
      const lessonTiles = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lessonTiles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LessonTiles', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LessonTiles', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LessonTiles', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLessonTilesToCollectionIfMissing', () => {
      it('should add a LessonTiles to an empty array', () => {
        const lessonTiles: ILessonTiles = sampleWithRequiredData;
        expectedResult = service.addLessonTilesToCollectionIfMissing([], lessonTiles);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lessonTiles);
      });

      it('should not add a LessonTiles to an array that contains it', () => {
        const lessonTiles: ILessonTiles = sampleWithRequiredData;
        const lessonTilesCollection: ILessonTiles[] = [
          {
            ...lessonTiles,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLessonTilesToCollectionIfMissing(lessonTilesCollection, lessonTiles);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LessonTiles to an array that doesn't contain it", () => {
        const lessonTiles: ILessonTiles = sampleWithRequiredData;
        const lessonTilesCollection: ILessonTiles[] = [sampleWithPartialData];
        expectedResult = service.addLessonTilesToCollectionIfMissing(lessonTilesCollection, lessonTiles);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lessonTiles);
      });

      it('should add only unique LessonTiles to an array', () => {
        const lessonTilesArray: ILessonTiles[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lessonTilesCollection: ILessonTiles[] = [sampleWithRequiredData];
        expectedResult = service.addLessonTilesToCollectionIfMissing(lessonTilesCollection, ...lessonTilesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lessonTiles: ILessonTiles = sampleWithRequiredData;
        const lessonTiles2: ILessonTiles = sampleWithPartialData;
        expectedResult = service.addLessonTilesToCollectionIfMissing([], lessonTiles, lessonTiles2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lessonTiles);
        expect(expectedResult).toContain(lessonTiles2);
      });

      it('should accept null and undefined values', () => {
        const lessonTiles: ILessonTiles = sampleWithRequiredData;
        expectedResult = service.addLessonTilesToCollectionIfMissing([], null, lessonTiles, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lessonTiles);
      });

      it('should return initial array if no LessonTiles is added', () => {
        const lessonTilesCollection: ILessonTiles[] = [sampleWithRequiredData];
        expectedResult = service.addLessonTilesToCollectionIfMissing(lessonTilesCollection, undefined, null);
        expect(expectedResult).toEqual(lessonTilesCollection);
      });
    });

    describe('compareLessonTiles', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLessonTiles(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLessonTiles(entity1, entity2);
        const compareResult2 = service.compareLessonTiles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLessonTiles(entity1, entity2);
        const compareResult2 = service.compareLessonTiles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLessonTiles(entity1, entity2);
        const compareResult2 = service.compareLessonTiles(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
