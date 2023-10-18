import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../learning.test-samples';

import { LearningFormService } from './learning-form.service';

describe('Learning Form Service', () => {
  let service: LearningFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningFormService);
  });

  describe('Service methods', () => {
    describe('createLearningFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLearningFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            lesson: expect.any(Object),
          })
        );
      });

      it('passing ILearning should create a new form with FormGroup', () => {
        const formGroup = service.createLearningFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            lesson: expect.any(Object),
          })
        );
      });
    });

    describe('getLearning', () => {
      it('should return NewLearning for default Learning initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLearningFormGroup(sampleWithNewData);

        const learning = service.getLearning(formGroup) as any;

        expect(learning).toMatchObject(sampleWithNewData);
      });

      it('should return NewLearning for empty Learning initial value', () => {
        const formGroup = service.createLearningFormGroup();

        const learning = service.getLearning(formGroup) as any;

        expect(learning).toMatchObject({});
      });

      it('should return ILearning', () => {
        const formGroup = service.createLearningFormGroup(sampleWithRequiredData);

        const learning = service.getLearning(formGroup) as any;

        expect(learning).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILearning should not enable id FormControl', () => {
        const formGroup = service.createLearningFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLearning should disable id FormControl', () => {
        const formGroup = service.createLearningFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
