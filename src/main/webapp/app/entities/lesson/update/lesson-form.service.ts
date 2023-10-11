import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILesson, NewLesson } from '../lesson.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILesson for edit and NewLessonFormGroupInput for create.
 */
type LessonFormGroupInput = ILesson | PartialWithRequiredKeyOf<NewLesson>;

type LessonFormDefaults = Pick<NewLesson, 'id'>;

type LessonFormGroupContent = {
  id: FormControl<ILesson['id'] | NewLesson['id']>;
  title: FormControl<ILesson['title']>;
  language: FormControl<ILesson['language']>;
  level: FormControl<ILesson['level']>;
};

export type LessonFormGroup = FormGroup<LessonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LessonFormService {
  createLessonFormGroup(lesson: LessonFormGroupInput = { id: null }): LessonFormGroup {
    const lessonRawValue = {
      ...this.getFormDefaults(),
      ...lesson,
    };
    return new FormGroup<LessonFormGroupContent>({
      id: new FormControl(
        { value: lessonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(lessonRawValue.title, {
        validators: [Validators.required],
      }),
      language: new FormControl(lessonRawValue.language, {
        validators: [Validators.required],
      }),
      level: new FormControl(lessonRawValue.level, {
        validators: [Validators.required],
      }),
    });
  }

  getLesson(form: LessonFormGroup): ILesson | NewLesson {
    return form.getRawValue() as ILesson | NewLesson;
  }

  resetForm(form: LessonFormGroup, lesson: LessonFormGroupInput): void {
    const lessonRawValue = { ...this.getFormDefaults(), ...lesson };
    form.reset(
      {
        ...lessonRawValue,
        id: { value: lessonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LessonFormDefaults {
    return {
      id: null,
    };
  }
}
