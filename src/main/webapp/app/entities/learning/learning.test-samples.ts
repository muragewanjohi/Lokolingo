import dayjs from 'dayjs/esm';

import { ILearning, NewLearning } from './learning.model';

export const sampleWithRequiredData: ILearning = {
  id: 55445,
  startDate: dayjs('2023-10-10T21:08'),
};

export const sampleWithPartialData: ILearning = {
  id: 97464,
  startDate: dayjs('2023-10-11T19:54'),
  endDate: dayjs('2023-10-11T06:55'),
};

export const sampleWithFullData: ILearning = {
  id: 81676,
  startDate: dayjs('2023-10-11T04:40'),
  endDate: dayjs('2023-10-11T18:28'),
};

export const sampleWithNewData: NewLearning = {
  startDate: dayjs('2023-10-11T12:56'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
