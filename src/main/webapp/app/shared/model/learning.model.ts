import dayjs from 'dayjs';
import { ISubject } from 'app/shared/model/subject.model';
import { IChild } from 'app/shared/model/child.model';
import { Language } from 'app/shared/model/enumerations/language.model';

export interface ILearning {
  id?: number;
  startDate?: string;
  endDate?: string | null;
  language?: Language;
  subjects?: ISubject[] | null;
  child?: IChild | null;
}

export const defaultValue: Readonly<ILearning> = {};
