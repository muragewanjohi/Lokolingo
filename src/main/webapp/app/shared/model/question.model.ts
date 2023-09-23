import { IMultipleChoice } from 'app/shared/model/multiple-choice.model';
import { ITile } from 'app/shared/model/tile.model';

export interface IQuestion {
  id?: number;
  description?: string;
  audioContentType?: string;
  audio?: string;
  audioDescription?: string;
  multipleChoices?: IMultipleChoice[] | null;
  tile?: ITile | null;
}

export const defaultValue: Readonly<IQuestion> = {};
