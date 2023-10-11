import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMultipleChoice } from '../multiple-choice.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../multiple-choice.test-samples';

import { MultipleChoiceService } from './multiple-choice.service';

const requireRestSample: IMultipleChoice = {
  ...sampleWithRequiredData,
};

describe('MultipleChoice Service', () => {
  let service: MultipleChoiceService;
  let httpMock: HttpTestingController;
  let expectedResult: IMultipleChoice | IMultipleChoice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MultipleChoiceService);
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

    it('should create a MultipleChoice', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const multipleChoice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(multipleChoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MultipleChoice', () => {
      const multipleChoice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(multipleChoice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MultipleChoice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MultipleChoice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MultipleChoice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMultipleChoiceToCollectionIfMissing', () => {
      it('should add a MultipleChoice to an empty array', () => {
        const multipleChoice: IMultipleChoice = sampleWithRequiredData;
        expectedResult = service.addMultipleChoiceToCollectionIfMissing([], multipleChoice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(multipleChoice);
      });

      it('should not add a MultipleChoice to an array that contains it', () => {
        const multipleChoice: IMultipleChoice = sampleWithRequiredData;
        const multipleChoiceCollection: IMultipleChoice[] = [
          {
            ...multipleChoice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMultipleChoiceToCollectionIfMissing(multipleChoiceCollection, multipleChoice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MultipleChoice to an array that doesn't contain it", () => {
        const multipleChoice: IMultipleChoice = sampleWithRequiredData;
        const multipleChoiceCollection: IMultipleChoice[] = [sampleWithPartialData];
        expectedResult = service.addMultipleChoiceToCollectionIfMissing(multipleChoiceCollection, multipleChoice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(multipleChoice);
      });

      it('should add only unique MultipleChoice to an array', () => {
        const multipleChoiceArray: IMultipleChoice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const multipleChoiceCollection: IMultipleChoice[] = [sampleWithRequiredData];
        expectedResult = service.addMultipleChoiceToCollectionIfMissing(multipleChoiceCollection, ...multipleChoiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const multipleChoice: IMultipleChoice = sampleWithRequiredData;
        const multipleChoice2: IMultipleChoice = sampleWithPartialData;
        expectedResult = service.addMultipleChoiceToCollectionIfMissing([], multipleChoice, multipleChoice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(multipleChoice);
        expect(expectedResult).toContain(multipleChoice2);
      });

      it('should accept null and undefined values', () => {
        const multipleChoice: IMultipleChoice = sampleWithRequiredData;
        expectedResult = service.addMultipleChoiceToCollectionIfMissing([], null, multipleChoice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(multipleChoice);
      });

      it('should return initial array if no MultipleChoice is added', () => {
        const multipleChoiceCollection: IMultipleChoice[] = [sampleWithRequiredData];
        expectedResult = service.addMultipleChoiceToCollectionIfMissing(multipleChoiceCollection, undefined, null);
        expect(expectedResult).toEqual(multipleChoiceCollection);
      });
    });

    describe('compareMultipleChoice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMultipleChoice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMultipleChoice(entity1, entity2);
        const compareResult2 = service.compareMultipleChoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMultipleChoice(entity1, entity2);
        const compareResult2 = service.compareMultipleChoice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMultipleChoice(entity1, entity2);
        const compareResult2 = service.compareMultipleChoice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
