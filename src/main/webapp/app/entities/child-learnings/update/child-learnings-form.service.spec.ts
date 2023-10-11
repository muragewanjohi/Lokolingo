import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../child-learnings.test-samples';

import { ChildLearningsFormService } from './child-learnings-form.service';

describe('ChildLearnings Form Service', () => {
  let service: ChildLearningsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildLearningsFormService);
  });

  describe('Service methods', () => {
    describe('createChildLearningsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChildLearningsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            child: expect.any(Object),
            learning: expect.any(Object),
          })
        );
      });

      it('passing IChildLearnings should create a new form with FormGroup', () => {
        const formGroup = service.createChildLearningsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            child: expect.any(Object),
            learning: expect.any(Object),
          })
        );
      });
    });

    describe('getChildLearnings', () => {
      it('should return NewChildLearnings for default ChildLearnings initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChildLearningsFormGroup(sampleWithNewData);

        const childLearnings = service.getChildLearnings(formGroup) as any;

        expect(childLearnings).toMatchObject(sampleWithNewData);
      });

      it('should return NewChildLearnings for empty ChildLearnings initial value', () => {
        const formGroup = service.createChildLearningsFormGroup();

        const childLearnings = service.getChildLearnings(formGroup) as any;

        expect(childLearnings).toMatchObject({});
      });

      it('should return IChildLearnings', () => {
        const formGroup = service.createChildLearningsFormGroup(sampleWithRequiredData);

        const childLearnings = service.getChildLearnings(formGroup) as any;

        expect(childLearnings).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChildLearnings should not enable id FormControl', () => {
        const formGroup = service.createChildLearningsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChildLearnings should disable id FormControl', () => {
        const formGroup = service.createChildLearningsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
