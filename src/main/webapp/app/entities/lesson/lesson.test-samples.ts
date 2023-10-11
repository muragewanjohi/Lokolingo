import { Language } from 'app/entities/enumerations/language.model';
import { Level } from 'app/entities/enumerations/level.model';

import { ILesson, NewLesson } from './lesson.model';

export const sampleWithRequiredData: ILesson = {
  id: 77002,
  title: 'Philippines Strategist copying',
  language: Language['ENGLISH'],
  level: Level['SENIOR'],
};

export const sampleWithPartialData: ILesson = {
  id: 28889,
  title: 'front-end Coordinator',
  language: Language['KIKUYU'],
  level: Level['JUNIOR'],
};

export const sampleWithFullData: ILesson = {
  id: 99538,
  title: 'Card Branding',
  language: Language['SWAHILI'],
  level: Level['ADVANCED'],
};

export const sampleWithNewData: NewLesson = {
  title: 'capacitor',
  language: Language['SWAHILI'],
  level: Level['JUNIOR'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
