import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILessonTiles, NewLessonTiles } from '../lesson-tiles.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILessonTiles for edit and NewLessonTilesFormGroupInput for create.
 */
type LessonTilesFormGroupInput = ILessonTiles | PartialWithRequiredKeyOf<NewLessonTiles>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILessonTiles | NewLessonTiles> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type LessonTilesFormRawValue = FormValueOf<ILessonTiles>;

type NewLessonTilesFormRawValue = FormValueOf<NewLessonTiles>;

type LessonTilesFormDefaults = Pick<NewLessonTiles, 'id' | 'active' | 'createdAt' | 'updatedAt'>;

type LessonTilesFormGroupContent = {
  id: FormControl<LessonTilesFormRawValue['id'] | NewLessonTiles['id']>;
  active: FormControl<LessonTilesFormRawValue['active']>;
  createdAt: FormControl<LessonTilesFormRawValue['createdAt']>;
  updatedAt: FormControl<LessonTilesFormRawValue['updatedAt']>;
  lesson: FormControl<LessonTilesFormRawValue['lesson']>;
  tile: FormControl<LessonTilesFormRawValue['tile']>;
};

export type LessonTilesFormGroup = FormGroup<LessonTilesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LessonTilesFormService {
  createLessonTilesFormGroup(lessonTiles: LessonTilesFormGroupInput = { id: null }): LessonTilesFormGroup {
    const lessonTilesRawValue = this.convertLessonTilesToLessonTilesRawValue({
      ...this.getFormDefaults(),
      ...lessonTiles,
    });
    return new FormGroup<LessonTilesFormGroupContent>({
      id: new FormControl(
        { value: lessonTilesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      active: new FormControl(lessonTilesRawValue.active),
      createdAt: new FormControl(lessonTilesRawValue.createdAt),
      updatedAt: new FormControl(lessonTilesRawValue.updatedAt),
      lesson: new FormControl(lessonTilesRawValue.lesson),
      tile: new FormControl(lessonTilesRawValue.tile),
    });
  }

  getLessonTiles(form: LessonTilesFormGroup): ILessonTiles | NewLessonTiles {
    return this.convertLessonTilesRawValueToLessonTiles(form.getRawValue() as LessonTilesFormRawValue | NewLessonTilesFormRawValue);
  }

  resetForm(form: LessonTilesFormGroup, lessonTiles: LessonTilesFormGroupInput): void {
    const lessonTilesRawValue = this.convertLessonTilesToLessonTilesRawValue({ ...this.getFormDefaults(), ...lessonTiles });
    form.reset(
      {
        ...lessonTilesRawValue,
        id: { value: lessonTilesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LessonTilesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      active: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertLessonTilesRawValueToLessonTiles(
    rawLessonTiles: LessonTilesFormRawValue | NewLessonTilesFormRawValue
  ): ILessonTiles | NewLessonTiles {
    return {
      ...rawLessonTiles,
      createdAt: dayjs(rawLessonTiles.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawLessonTiles.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertLessonTilesToLessonTilesRawValue(
    lessonTiles: ILessonTiles | (Partial<NewLessonTiles> & LessonTilesFormDefaults)
  ): LessonTilesFormRawValue | PartialWithRequiredKeyOf<NewLessonTilesFormRawValue> {
    return {
      ...lessonTiles,
      createdAt: lessonTiles.createdAt ? lessonTiles.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: lessonTiles.updatedAt ? lessonTiles.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
