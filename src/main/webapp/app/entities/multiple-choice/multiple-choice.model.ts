import { IQuestion } from 'app/entities/question/question.model';
import { AnswerStatus } from 'app/entities/enumerations/answer-status.model';

export interface IMultipleChoice {
  id: number;
  status?: AnswerStatus | null;
  image?: string | null;
  imageContentType?: string | null;
  question?: Pick<IQuestion, 'id'> | null;
}

export type NewMultipleChoice = Omit<IMultipleChoice, 'id'> & { id: null };
