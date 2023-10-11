import { AgeGrouping } from 'app/entities/enumerations/age-grouping.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface ISubject {
  id: number;
  age?: AgeGrouping | null;
  language?: Language | null;
  title?: string | null;
}

export type NewSubject = Omit<ISubject, 'id'> & { id: null };
