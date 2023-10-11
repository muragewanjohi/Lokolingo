import { AgeGrouping } from 'app/entities/enumerations/age-grouping.model';
import { Language } from 'app/entities/enumerations/language.model';

import { ISubject, NewSubject } from './subject.model';

export const sampleWithRequiredData: ISubject = {
  id: 33079,
  language: Language['KIKUYU'],
  title: 'intranet port Jamaican',
};

export const sampleWithPartialData: ISubject = {
  id: 83496,
  language: Language['SWAHILI'],
  title: 'Administrator users Dynamic',
};

export const sampleWithFullData: ISubject = {
  id: 28392,
  age: AgeGrouping['TEEN'],
  language: Language['SWAHILI'],
  title: 'Multi-layered reboot',
};

export const sampleWithNewData: NewSubject = {
  language: Language['KIKUYU'],
  title: 'reboot Central Hat',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
