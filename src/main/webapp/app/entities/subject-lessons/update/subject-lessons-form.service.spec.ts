import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../subject-lessons.test-samples';

import { SubjectLessonsFormService } from './subject-lessons-form.service';

describe('SubjectLessons Form Service', () => {
  let service: SubjectLessonsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectLessonsFormService);
  });

  describe('Service methods', () => {
    describe('createSubjectLessonsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSubjectLessonsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            subject: expect.any(Object),
            lesson: expect.any(Object),
          })
        );
      });

      it('passing ISubjectLessons should create a new form with FormGroup', () => {
        const formGroup = service.createSubjectLessonsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            subject: expect.any(Object),
            lesson: expect.any(Object),
          })
        );
      });
    });

    describe('getSubjectLessons', () => {
      it('should return NewSubjectLessons for default SubjectLessons initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSubjectLessonsFormGroup(sampleWithNewData);

        const subjectLessons = service.getSubjectLessons(formGroup) as any;

        expect(subjectLessons).toMatchObject(sampleWithNewData);
      });

      it('should return NewSubjectLessons for empty SubjectLessons initial value', () => {
        const formGroup = service.createSubjectLessonsFormGroup();

        const subjectLessons = service.getSubjectLessons(formGroup) as any;

        expect(subjectLessons).toMatchObject({});
      });

      it('should return ISubjectLessons', () => {
        const formGroup = service.createSubjectLessonsFormGroup(sampleWithRequiredData);

        const subjectLessons = service.getSubjectLessons(formGroup) as any;

        expect(subjectLessons).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISubjectLessons should not enable id FormControl', () => {
        const formGroup = service.createSubjectLessonsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSubjectLessons should disable id FormControl', () => {
        const formGroup = service.createSubjectLessonsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
