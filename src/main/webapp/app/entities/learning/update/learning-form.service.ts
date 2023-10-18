import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILearning, NewLearning } from '../learning.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILearning for edit and NewLearningFormGroupInput for create.
 */
type LearningFormGroupInput = ILearning | PartialWithRequiredKeyOf<NewLearning>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILearning | NewLearning> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type LearningFormRawValue = FormValueOf<ILearning>;

type NewLearningFormRawValue = FormValueOf<NewLearning>;

type LearningFormDefaults = Pick<NewLearning, 'id' | 'startDate' | 'endDate'>;

type LearningFormGroupContent = {
  id: FormControl<LearningFormRawValue['id'] | NewLearning['id']>;
  startDate: FormControl<LearningFormRawValue['startDate']>;
  endDate: FormControl<LearningFormRawValue['endDate']>;
  lesson: FormControl<LearningFormRawValue['lesson']>;
};

export type LearningFormGroup = FormGroup<LearningFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LearningFormService {
  createLearningFormGroup(learning: LearningFormGroupInput = { id: null }): LearningFormGroup {
    const learningRawValue = this.convertLearningToLearningRawValue({
      ...this.getFormDefaults(),
      ...learning,
    });
    return new FormGroup<LearningFormGroupContent>({
      id: new FormControl(
        { value: learningRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startDate: new FormControl(learningRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(learningRawValue.endDate),
      lesson: new FormControl(learningRawValue.lesson),
    });
  }

  getLearning(form: LearningFormGroup): ILearning | NewLearning {
    return this.convertLearningRawValueToLearning(form.getRawValue() as LearningFormRawValue | NewLearningFormRawValue);
  }

  resetForm(form: LearningFormGroup, learning: LearningFormGroupInput): void {
    const learningRawValue = this.convertLearningToLearningRawValue({ ...this.getFormDefaults(), ...learning });
    form.reset(
      {
        ...learningRawValue,
        id: { value: learningRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LearningFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertLearningRawValueToLearning(rawLearning: LearningFormRawValue | NewLearningFormRawValue): ILearning | NewLearning {
    return {
      ...rawLearning,
      startDate: dayjs(rawLearning.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawLearning.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertLearningToLearningRawValue(
    learning: ILearning | (Partial<NewLearning> & LearningFormDefaults)
  ): LearningFormRawValue | PartialWithRequiredKeyOf<NewLearningFormRawValue> {
    return {
      ...learning,
      startDate: learning.startDate ? learning.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: learning.endDate ? learning.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
