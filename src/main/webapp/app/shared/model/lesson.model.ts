import { ITile } from 'app/shared/model/tile.model';
import { ISubject } from 'app/shared/model/subject.model';
import { Language } from 'app/shared/model/enumerations/language.model';
import { Level } from 'app/shared/model/enumerations/level.model';

export interface ILesson {
  id?: number;
  title?: string;
  language?: Language;
  level?: Level;
  tiles?: ITile[] | null;
  subject?: ISubject | null;
}

export const defaultValue: Readonly<ILesson> = {};
