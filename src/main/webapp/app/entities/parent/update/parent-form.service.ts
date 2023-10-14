import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParent, NewParent } from '../parent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParent for edit and NewParentFormGroupInput for create.
 */
type ParentFormGroupInput = IParent | PartialWithRequiredKeyOf<NewParent>;

type ParentFormDefaults = Pick<NewParent, 'id'>;

type ParentFormGroupContent = {
  id: FormControl<IParent['id'] | NewParent['id']>;
  firstName: FormControl<IParent['firstName']>;
  lastName: FormControl<IParent['lastName']>;
  email: FormControl<IParent['email']>;
  phone: FormControl<IParent['phone']>;
  user: FormControl<IParent['user']>;
};

export type ParentFormGroup = FormGroup<ParentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParentFormService {
  createParentFormGroup(parent: ParentFormGroupInput = { id: null }): ParentFormGroup {
    const parentRawValue = {
      ...this.getFormDefaults(),
      ...parent,
    };
    return new FormGroup<ParentFormGroupContent>({
      id: new FormControl(
        { value: parentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(parentRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(parentRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(parentRawValue.email, {
        validators: [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')],
      }),
      phone: new FormControl(parentRawValue.phone, {
        validators: [Validators.required],
      }),
      user: new FormControl(parentRawValue.user),
    });
  }

  getParent(form: ParentFormGroup): IParent | NewParent {
    return form.getRawValue() as IParent | NewParent;
  }

  resetForm(form: ParentFormGroup, parent: ParentFormGroupInput): void {
    const parentRawValue = { ...this.getFormDefaults(), ...parent };
    form.reset(
      {
        ...parentRawValue,
        id: { value: parentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParentFormDefaults {
    return {
      id: null,
    };
  }
}
