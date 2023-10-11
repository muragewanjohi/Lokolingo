import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChild, NewChild } from '../child.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChild for edit and NewChildFormGroupInput for create.
 */
type ChildFormGroupInput = IChild | PartialWithRequiredKeyOf<NewChild>;

type ChildFormDefaults = Pick<NewChild, 'id'>;

type ChildFormGroupContent = {
  id: FormControl<IChild['id'] | NewChild['id']>;
  firstName: FormControl<IChild['firstName']>;
  lastName: FormControl<IChild['lastName']>;
  gender: FormControl<IChild['gender']>;
  age: FormControl<IChild['age']>;
  parent: FormControl<IChild['parent']>;
};

export type ChildFormGroup = FormGroup<ChildFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChildFormService {
  createChildFormGroup(child: ChildFormGroupInput = { id: null }): ChildFormGroup {
    const childRawValue = {
      ...this.getFormDefaults(),
      ...child,
    };
    return new FormGroup<ChildFormGroupContent>({
      id: new FormControl(
        { value: childRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(childRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(childRawValue.lastName, {
        validators: [Validators.required],
      }),
      gender: new FormControl(childRawValue.gender, {
        validators: [Validators.required],
      }),
      age: new FormControl(childRawValue.age),
      parent: new FormControl(childRawValue.parent),
    });
  }

  getChild(form: ChildFormGroup): IChild | NewChild {
    return form.getRawValue() as IChild | NewChild;
  }

  resetForm(form: ChildFormGroup, child: ChildFormGroupInput): void {
    const childRawValue = { ...this.getFormDefaults(), ...child };
    form.reset(
      {
        ...childRawValue,
        id: { value: childRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChildFormDefaults {
    return {
      id: null,
    };
  }
}
