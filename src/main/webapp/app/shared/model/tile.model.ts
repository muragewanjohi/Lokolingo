import { IQuestion } from 'app/shared/model/question.model';
import { ILesson } from 'app/shared/model/lesson.model';
import { LockedStatus } from 'app/shared/model/enumerations/locked-status.model';

export interface ITile {
  id?: number;
  status?: LockedStatus;
  imageContentType?: string;
  image?: string;
  audioContentType?: string;
  audio?: string;
  languageTitle?: string;
  englishTitle?: string;
  question?: IQuestion | null;
  lesson?: ILesson | null;
}

export const defaultValue: Readonly<ITile> = {};
