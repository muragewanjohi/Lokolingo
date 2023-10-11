import { Language } from 'app/entities/enumerations/language.model';
import { Level } from 'app/entities/enumerations/level.model';

export interface ILesson {
  id: number;
  title?: string | null;
  language?: Language | null;
  level?: Level | null;
}

export type NewLesson = Omit<ILesson, 'id'> & { id: null };
