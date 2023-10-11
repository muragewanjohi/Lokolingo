import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChildLearnings, NewChildLearnings } from '../child-learnings.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChildLearnings for edit and NewChildLearningsFormGroupInput for create.
 */
type ChildLearningsFormGroupInput = IChildLearnings | PartialWithRequiredKeyOf<NewChildLearnings>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IChildLearnings | NewChildLearnings> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ChildLearningsFormRawValue = FormValueOf<IChildLearnings>;

type NewChildLearningsFormRawValue = FormValueOf<NewChildLearnings>;

type ChildLearningsFormDefaults = Pick<NewChildLearnings, 'id' | 'active' | 'createdAt' | 'updatedAt'>;

type ChildLearningsFormGroupContent = {
  id: FormControl<ChildLearningsFormRawValue['id'] | NewChildLearnings['id']>;
  active: FormControl<ChildLearningsFormRawValue['active']>;
  createdAt: FormControl<ChildLearningsFormRawValue['createdAt']>;
  updatedAt: FormControl<ChildLearningsFormRawValue['updatedAt']>;
  child: FormControl<ChildLearningsFormRawValue['child']>;
  learning: FormControl<ChildLearningsFormRawValue['learning']>;
};

export type ChildLearningsFormGroup = FormGroup<ChildLearningsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChildLearningsFormService {
  createChildLearningsFormGroup(childLearnings: ChildLearningsFormGroupInput = { id: null }): ChildLearningsFormGroup {
    const childLearningsRawValue = this.convertChildLearningsToChildLearningsRawValue({
      ...this.getFormDefaults(),
      ...childLearnings,
    });
    return new FormGroup<ChildLearningsFormGroupContent>({
      id: new FormControl(
        { value: childLearningsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      active: new FormControl(childLearningsRawValue.active),
      createdAt: new FormControl(childLearningsRawValue.createdAt),
      updatedAt: new FormControl(childLearningsRawValue.updatedAt),
      child: new FormControl(childLearningsRawValue.child),
      learning: new FormControl(childLearningsRawValue.learning),
    });
  }

  getChildLearnings(form: ChildLearningsFormGroup): IChildLearnings | NewChildLearnings {
    return this.convertChildLearningsRawValueToChildLearnings(
      form.getRawValue() as ChildLearningsFormRawValue | NewChildLearningsFormRawValue
    );
  }

  resetForm(form: ChildLearningsFormGroup, childLearnings: ChildLearningsFormGroupInput): void {
    const childLearningsRawValue = this.convertChildLearningsToChildLearningsRawValue({ ...this.getFormDefaults(), ...childLearnings });
    form.reset(
      {
        ...childLearningsRawValue,
        id: { value: childLearningsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChildLearningsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      active: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertChildLearningsRawValueToChildLearnings(
    rawChildLearnings: ChildLearningsFormRawValue | NewChildLearningsFormRawValue
  ): IChildLearnings | NewChildLearnings {
    return {
      ...rawChildLearnings,
      createdAt: dayjs(rawChildLearnings.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawChildLearnings.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertChildLearningsToChildLearningsRawValue(
    childLearnings: IChildLearnings | (Partial<NewChildLearnings> & ChildLearningsFormDefaults)
  ): ChildLearningsFormRawValue | PartialWithRequiredKeyOf<NewChildLearningsFormRawValue> {
    return {
      ...childLearnings,
      createdAt: childLearnings.createdAt ? childLearnings.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: childLearnings.updatedAt ? childLearnings.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
