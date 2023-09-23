import { ILesson } from 'app/shared/model/lesson.model';
import { ILearning } from 'app/shared/model/learning.model';
import { AgeGrouping } from 'app/shared/model/enumerations/age-grouping.model';
import { Language } from 'app/shared/model/enumerations/language.model';

export interface ISubject {
  id?: number;
  age?: AgeGrouping | null;
  language?: Language;
  title?: string;
  lessons?: ILesson[] | null;
  learning?: ILearning | null;
}

export const defaultValue: Readonly<ISubject> = {};
