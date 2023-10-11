import dayjs from 'dayjs/esm';

import { IChildLearnings, NewChildLearnings } from './child-learnings.model';

export const sampleWithRequiredData: IChildLearnings = {
  id: 19442,
};

export const sampleWithPartialData: IChildLearnings = {
  id: 28500,
};

export const sampleWithFullData: IChildLearnings = {
  id: 73677,
  active: true,
  createdAt: dayjs('2023-10-11T01:23'),
  updatedAt: dayjs('2023-10-11T10:15'),
};

export const sampleWithNewData: NewChildLearnings = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
