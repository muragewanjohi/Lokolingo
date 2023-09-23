import { IQuestion } from 'app/shared/model/question.model';
import { AnswerStatus } from 'app/shared/model/enumerations/answer-status.model';

export interface IMultipleChoice {
  id?: number;
  status?: AnswerStatus;
  imageContentType?: string;
  image?: string;
  question?: IQuestion | null;
}

export const defaultValue: Readonly<IMultipleChoice> = {};
