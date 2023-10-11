import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITile, NewTile } from '../tile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITile for edit and NewTileFormGroupInput for create.
 */
type TileFormGroupInput = ITile | PartialWithRequiredKeyOf<NewTile>;

type TileFormDefaults = Pick<NewTile, 'id'>;

type TileFormGroupContent = {
  id: FormControl<ITile['id'] | NewTile['id']>;
  status: FormControl<ITile['status']>;
  image: FormControl<ITile['image']>;
  imageContentType: FormControl<ITile['imageContentType']>;
  audio: FormControl<ITile['audio']>;
  audioContentType: FormControl<ITile['audioContentType']>;
  languageTitle: FormControl<ITile['languageTitle']>;
  englishTitle: FormControl<ITile['englishTitle']>;
  question: FormControl<ITile['question']>;
};

export type TileFormGroup = FormGroup<TileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TileFormService {
  createTileFormGroup(tile: TileFormGroupInput = { id: null }): TileFormGroup {
    const tileRawValue = {
      ...this.getFormDefaults(),
      ...tile,
    };
    return new FormGroup<TileFormGroupContent>({
      id: new FormControl(
        { value: tileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      status: new FormControl(tileRawValue.status, {
        validators: [Validators.required],
      }),
      image: new FormControl(tileRawValue.image, {
        validators: [Validators.required],
      }),
      imageContentType: new FormControl(tileRawValue.imageContentType),
      audio: new FormControl(tileRawValue.audio, {
        validators: [Validators.required],
      }),
      audioContentType: new FormControl(tileRawValue.audioContentType),
      languageTitle: new FormControl(tileRawValue.languageTitle, {
        validators: [Validators.required],
      }),
      englishTitle: new FormControl(tileRawValue.englishTitle, {
        validators: [Validators.required],
      }),
      question: new FormControl(tileRawValue.question),
    });
  }

  getTile(form: TileFormGroup): ITile | NewTile {
    return form.getRawValue() as ITile | NewTile;
  }

  resetForm(form: TileFormGroup, tile: TileFormGroupInput): void {
    const tileRawValue = { ...this.getFormDefaults(), ...tile };
    form.reset(
      {
        ...tileRawValue,
        id: { value: tileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TileFormDefaults {
    return {
      id: null,
    };
  }
}
