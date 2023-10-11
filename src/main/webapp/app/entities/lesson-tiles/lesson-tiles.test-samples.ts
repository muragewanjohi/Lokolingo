import dayjs from 'dayjs/esm';

import { ILessonTiles, NewLessonTiles } from './lesson-tiles.model';

export const sampleWithRequiredData: ILessonTiles = {
  id: 62543,
};

export const sampleWithPartialData: ILessonTiles = {
  id: 93539,
  createdAt: dayjs('2023-10-11T10:07'),
};

export const sampleWithFullData: ILessonTiles = {
  id: 21174,
  active: true,
  createdAt: dayjs('2023-10-10T22:03'),
  updatedAt: dayjs('2023-10-10T22:32'),
};

export const sampleWithNewData: NewLessonTiles = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
