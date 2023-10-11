import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lesson-tiles.test-samples';

import { LessonTilesFormService } from './lesson-tiles-form.service';

describe('LessonTiles Form Service', () => {
  let service: LessonTilesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonTilesFormService);
  });

  describe('Service methods', () => {
    describe('createLessonTilesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLessonTilesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            lesson: expect.any(Object),
            tile: expect.any(Object),
          })
        );
      });

      it('passing ILessonTiles should create a new form with FormGroup', () => {
        const formGroup = service.createLessonTilesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            lesson: expect.any(Object),
            tile: expect.any(Object),
          })
        );
      });
    });

    describe('getLessonTiles', () => {
      it('should return NewLessonTiles for default LessonTiles initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLessonTilesFormGroup(sampleWithNewData);

        const lessonTiles = service.getLessonTiles(formGroup) as any;

        expect(lessonTiles).toMatchObject(sampleWithNewData);
      });

      it('should return NewLessonTiles for empty LessonTiles initial value', () => {
        const formGroup = service.createLessonTilesFormGroup();

        const lessonTiles = service.getLessonTiles(formGroup) as any;

        expect(lessonTiles).toMatchObject({});
      });

      it('should return ILessonTiles', () => {
        const formGroup = service.createLessonTilesFormGroup(sampleWithRequiredData);

        const lessonTiles = service.getLessonTiles(formGroup) as any;

        expect(lessonTiles).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILessonTiles should not enable id FormControl', () => {
        const formGroup = service.createLessonTilesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLessonTiles should disable id FormControl', () => {
        const formGroup = service.createLessonTilesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
