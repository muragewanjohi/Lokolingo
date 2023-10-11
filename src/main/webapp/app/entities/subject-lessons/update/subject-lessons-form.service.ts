import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISubjectLessons, NewSubjectLessons } from '../subject-lessons.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISubjectLessons for edit and NewSubjectLessonsFormGroupInput for create.
 */
type SubjectLessonsFormGroupInput = ISubjectLessons | PartialWithRequiredKeyOf<NewSubjectLessons>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISubjectLessons | NewSubjectLessons> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type SubjectLessonsFormRawValue = FormValueOf<ISubjectLessons>;

type NewSubjectLessonsFormRawValue = FormValueOf<NewSubjectLessons>;

type SubjectLessonsFormDefaults = Pick<NewSubjectLessons, 'id' | 'active' | 'createdAt' | 'updatedAt'>;

type SubjectLessonsFormGroupContent = {
  id: FormControl<SubjectLessonsFormRawValue['id'] | NewSubjectLessons['id']>;
  active: FormControl<SubjectLessonsFormRawValue['active']>;
  createdAt: FormControl<SubjectLessonsFormRawValue['createdAt']>;
  updatedAt: FormControl<SubjectLessonsFormRawValue['updatedAt']>;
  subject: FormControl<SubjectLessonsFormRawValue['subject']>;
  lesson: FormControl<SubjectLessonsFormRawValue['lesson']>;
};

export type SubjectLessonsFormGroup = FormGroup<SubjectLessonsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SubjectLessonsFormService {
  createSubjectLessonsFormGroup(subjectLessons: SubjectLessonsFormGroupInput = { id: null }): SubjectLessonsFormGroup {
    const subjectLessonsRawValue = this.convertSubjectLessonsToSubjectLessonsRawValue({
      ...this.getFormDefaults(),
      ...subjectLessons,
    });
    return new FormGroup<SubjectLessonsFormGroupContent>({
      id: new FormControl(
        { value: subjectLessonsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      active: new FormControl(subjectLessonsRawValue.active),
      createdAt: new FormControl(subjectLessonsRawValue.createdAt),
      updatedAt: new FormControl(subjectLessonsRawValue.updatedAt),
      subject: new FormControl(subjectLessonsRawValue.subject),
      lesson: new FormControl(subjectLessonsRawValue.lesson),
    });
  }

  getSubjectLessons(form: SubjectLessonsFormGroup): ISubjectLessons | NewSubjectLessons {
    return this.convertSubjectLessonsRawValueToSubjectLessons(
      form.getRawValue() as SubjectLessonsFormRawValue | NewSubjectLessonsFormRawValue
    );
  }

  resetForm(form: SubjectLessonsFormGroup, subjectLessons: SubjectLessonsFormGroupInput): void {
    const subjectLessonsRawValue = this.convertSubjectLessonsToSubjectLessonsRawValue({ ...this.getFormDefaults(), ...subjectLessons });
    form.reset(
      {
        ...subjectLessonsRawValue,
        id: { value: subjectLessonsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SubjectLessonsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      active: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertSubjectLessonsRawValueToSubjectLessons(
    rawSubjectLessons: SubjectLessonsFormRawValue | NewSubjectLessonsFormRawValue
  ): ISubjectLessons | NewSubjectLessons {
    return {
      ...rawSubjectLessons,
      createdAt: dayjs(rawSubjectLessons.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawSubjectLessons.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertSubjectLessonsToSubjectLessonsRawValue(
    subjectLessons: ISubjectLessons | (Partial<NewSubjectLessons> & SubjectLessonsFormDefaults)
  ): SubjectLessonsFormRawValue | PartialWithRequiredKeyOf<NewSubjectLessonsFormRawValue> {
    return {
      ...subjectLessons,
      createdAt: subjectLessons.createdAt ? subjectLessons.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: subjectLessons.updatedAt ? subjectLessons.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
