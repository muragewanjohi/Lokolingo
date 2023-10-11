import { AnswerStatus } from 'app/entities/enumerations/answer-status.model';

import { IMultipleChoice, NewMultipleChoice } from './multiple-choice.model';

export const sampleWithRequiredData: IMultipleChoice = {
  id: 38120,
  status: AnswerStatus['CORRECT'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithPartialData: IMultipleChoice = {
  id: 81713,
  status: AnswerStatus['CORRECT'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IMultipleChoice = {
  id: 18777,
  status: AnswerStatus['CORRECT'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewMultipleChoice = {
  status: AnswerStatus['CORRECT'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
