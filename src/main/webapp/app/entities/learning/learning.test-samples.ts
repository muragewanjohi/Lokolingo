import dayjs from 'dayjs/esm';

import { Language } from 'app/entities/enumerations/language.model';

import { ILearning, NewLearning } from './learning.model';

export const sampleWithRequiredData: ILearning = {
  id: 55445,
  startDate: dayjs('2023-10-10T21:08'),
  language: Language['KAMBA'],
};

export const sampleWithPartialData: ILearning = {
  id: 1384,
  startDate: dayjs('2023-10-11T06:55'),
  endDate: dayjs('2023-10-11T00:38'),
  language: Language['SWAHILI'],
};

export const sampleWithFullData: ILearning = {
  id: 7406,
  startDate: dayjs('2023-10-11T12:56'),
  endDate: dayjs('2023-10-11T16:44'),
  language: Language['SWAHILI'],
};

export const sampleWithNewData: NewLearning = {
  startDate: dayjs('2023-10-11T10:12'),
  language: Language['SWAHILI'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
