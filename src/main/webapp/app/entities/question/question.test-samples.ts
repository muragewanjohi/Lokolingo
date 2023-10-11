import { IQuestion, NewQuestion } from './question.model';

export const sampleWithRequiredData: IQuestion = {
  id: 47363,
  description: 'Account budgetary invoice',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  audioDescription: 'tan methodology',
};

export const sampleWithPartialData: IQuestion = {
  id: 15405,
  description: 'invoice e-tailers Venezuela',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  audioDescription: 'Interface Buckinghamshire',
};

export const sampleWithFullData: IQuestion = {
  id: 61305,
  description: 'Intranet parse Franc',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  audioDescription: 'Account portals',
};

export const sampleWithNewData: NewQuestion = {
  description: 'Kwacha extensible',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  audioDescription: 'Beauty Pennsylvania Fresh',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
