import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITile } from '../tile.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tile.test-samples';

import { TileService } from './tile.service';

const requireRestSample: ITile = {
  ...sampleWithRequiredData,
};

describe('Tile Service', () => {
  let service: TileService;
  let httpMock: HttpTestingController;
  let expectedResult: ITile | ITile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TileService);
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

    it('should create a Tile', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tile = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tile', () => {
      const tile = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tile', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tile', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tile', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTileToCollectionIfMissing', () => {
      it('should add a Tile to an empty array', () => {
        const tile: ITile = sampleWithRequiredData;
        expectedResult = service.addTileToCollectionIfMissing([], tile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tile);
      });

      it('should not add a Tile to an array that contains it', () => {
        const tile: ITile = sampleWithRequiredData;
        const tileCollection: ITile[] = [
          {
            ...tile,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTileToCollectionIfMissing(tileCollection, tile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tile to an array that doesn't contain it", () => {
        const tile: ITile = sampleWithRequiredData;
        const tileCollection: ITile[] = [sampleWithPartialData];
        expectedResult = service.addTileToCollectionIfMissing(tileCollection, tile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tile);
      });

      it('should add only unique Tile to an array', () => {
        const tileArray: ITile[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tileCollection: ITile[] = [sampleWithRequiredData];
        expectedResult = service.addTileToCollectionIfMissing(tileCollection, ...tileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tile: ITile = sampleWithRequiredData;
        const tile2: ITile = sampleWithPartialData;
        expectedResult = service.addTileToCollectionIfMissing([], tile, tile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tile);
        expect(expectedResult).toContain(tile2);
      });

      it('should accept null and undefined values', () => {
        const tile: ITile = sampleWithRequiredData;
        expectedResult = service.addTileToCollectionIfMissing([], null, tile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tile);
      });

      it('should return initial array if no Tile is added', () => {
        const tileCollection: ITile[] = [sampleWithRequiredData];
        expectedResult = service.addTileToCollectionIfMissing(tileCollection, undefined, null);
        expect(expectedResult).toEqual(tileCollection);
      });
    });

    describe('compareTile', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTile(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTile(entity1, entity2);
        const compareResult2 = service.compareTile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTile(entity1, entity2);
        const compareResult2 = service.compareTile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTile(entity1, entity2);
        const compareResult2 = service.compareTile(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
