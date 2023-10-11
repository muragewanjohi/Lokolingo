import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tile.test-samples';

import { TileFormService } from './tile-form.service';

describe('Tile Form Service', () => {
  let service: TileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileFormService);
  });

  describe('Service methods', () => {
    describe('createTileFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTileFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            image: expect.any(Object),
            audio: expect.any(Object),
            languageTitle: expect.any(Object),
            englishTitle: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });

      it('passing ITile should create a new form with FormGroup', () => {
        const formGroup = service.createTileFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            image: expect.any(Object),
            audio: expect.any(Object),
            languageTitle: expect.any(Object),
            englishTitle: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });
    });

    describe('getTile', () => {
      it('should return NewTile for default Tile initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTileFormGroup(sampleWithNewData);

        const tile = service.getTile(formGroup) as any;

        expect(tile).toMatchObject(sampleWithNewData);
      });

      it('should return NewTile for empty Tile initial value', () => {
        const formGroup = service.createTileFormGroup();

        const tile = service.getTile(formGroup) as any;

        expect(tile).toMatchObject({});
      });

      it('should return ITile', () => {
        const formGroup = service.createTileFormGroup(sampleWithRequiredData);

        const tile = service.getTile(formGroup) as any;

        expect(tile).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITile should not enable id FormControl', () => {
        const formGroup = service.createTileFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTile should disable id FormControl', () => {
        const formGroup = service.createTileFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
