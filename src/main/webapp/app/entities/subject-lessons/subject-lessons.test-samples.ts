import dayjs from 'dayjs/esm';

import { ISubjectLessons, NewSubjectLessons } from './subject-lessons.model';

export const sampleWithRequiredData: ISubjectLessons = {
  id: 78801,
};

export const sampleWithPartialData: ISubjectLessons = {
  id: 87695,
  updatedAt: dayjs('2023-10-11T13:00'),
};

export const sampleWithFullData: ISubjectLessons = {
  id: 1,
  active: true,
  createdAt: dayjs('2023-10-11T07:29'),
  updatedAt: dayjs('2023-10-11T19:42'),
};

export const sampleWithNewData: NewSubjectLessons = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
