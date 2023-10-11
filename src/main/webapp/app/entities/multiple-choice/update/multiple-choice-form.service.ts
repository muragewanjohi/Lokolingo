import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMultipleChoice, NewMultipleChoice } from '../multiple-choice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMultipleChoice for edit and NewMultipleChoiceFormGroupInput for create.
 */
type MultipleChoiceFormGroupInput = IMultipleChoice | PartialWithRequiredKeyOf<NewMultipleChoice>;

type MultipleChoiceFormDefaults = Pick<NewMultipleChoice, 'id'>;

type MultipleChoiceFormGroupContent = {
  id: FormControl<IMultipleChoice['id'] | NewMultipleChoice['id']>;
  status: FormControl<IMultipleChoice['status']>;
  image: FormControl<IMultipleChoice['image']>;
  imageContentType: FormControl<IMultipleChoice['imageContentType']>;
  question: FormControl<IMultipleChoice['question']>;
};

export type MultipleChoiceFormGroup = FormGroup<MultipleChoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MultipleChoiceFormService {
  createMultipleChoiceFormGroup(multipleChoice: MultipleChoiceFormGroupInput = { id: null }): MultipleChoiceFormGroup {
    const multipleChoiceRawValue = {
      ...this.getFormDefaults(),
      ...multipleChoice,
    };
    return new FormGroup<MultipleChoiceFormGroupContent>({
      id: new FormControl(
        { value: multipleChoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      status: new FormControl(multipleChoiceRawValue.status, {
        validators: [Validators.required],
      }),
      image: new FormControl(multipleChoiceRawValue.image, {
        validators: [Validators.required],
      }),
      imageContentType: new FormControl(multipleChoiceRawValue.imageContentType),
      question: new FormControl(multipleChoiceRawValue.question),
    });
  }

  getMultipleChoice(form: MultipleChoiceFormGroup): IMultipleChoice | NewMultipleChoice {
    return form.getRawValue() as IMultipleChoice | NewMultipleChoice;
  }

  resetForm(form: MultipleChoiceFormGroup, multipleChoice: MultipleChoiceFormGroupInput): void {
    const multipleChoiceRawValue = { ...this.getFormDefaults(), ...multipleChoice };
    form.reset(
      {
        ...multipleChoiceRawValue,
        id: { value: multipleChoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MultipleChoiceFormDefaults {
    return {
      id: null,
    };
  }
}
