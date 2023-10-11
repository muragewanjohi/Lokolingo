import { IQuestion } from 'app/entities/question/question.model';
import { LockedStatus } from 'app/entities/enumerations/locked-status.model';

export interface ITile {
  id: number;
  status?: LockedStatus | null;
  image?: string | null;
  imageContentType?: string | null;
  audio?: string | null;
  audioContentType?: string | null;
  languageTitle?: string | null;
  englishTitle?: string | null;
  question?: Pick<IQuestion, 'id'> | null;
}

export type NewTile = Omit<ITile, 'id'> & { id: null };
