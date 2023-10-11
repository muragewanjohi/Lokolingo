import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../multiple-choice.test-samples';

import { MultipleChoiceFormService } from './multiple-choice-form.service';

describe('MultipleChoice Form Service', () => {
  let service: MultipleChoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleChoiceFormService);
  });

  describe('Service methods', () => {
    describe('createMultipleChoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMultipleChoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            image: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });

      it('passing IMultipleChoice should create a new form with FormGroup', () => {
        const formGroup = service.createMultipleChoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            image: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });
    });

    describe('getMultipleChoice', () => {
      it('should return NewMultipleChoice for default MultipleChoice initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMultipleChoiceFormGroup(sampleWithNewData);

        const multipleChoice = service.getMultipleChoice(formGroup) as any;

        expect(multipleChoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewMultipleChoice for empty MultipleChoice initial value', () => {
        const formGroup = service.createMultipleChoiceFormGroup();

        const multipleChoice = service.getMultipleChoice(formGroup) as any;

        expect(multipleChoice).toMatchObject({});
      });

      it('should return IMultipleChoice', () => {
        const formGroup = service.createMultipleChoiceFormGroup(sampleWithRequiredData);

        const multipleChoice = service.getMultipleChoice(formGroup) as any;

        expect(multipleChoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMultipleChoice should not enable id FormControl', () => {
        const formGroup = service.createMultipleChoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMultipleChoice should disable id FormControl', () => {
        const formGroup = service.createMultipleChoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
