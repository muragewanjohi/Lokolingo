import { Gender } from 'app/entities/enumerations/gender.model';

import { IChild, NewChild } from './child.model';

export const sampleWithRequiredData: IChild = {
  id: 65912,
  firstName: 'Rosemary',
  lastName: 'Mante',
  gender: Gender['FEMALE'],
};

export const sampleWithPartialData: IChild = {
  id: 51914,
  firstName: 'Alejandrin',
  lastName: 'Batz',
  gender: Gender['FEMALE'],
  age: 43931,
};

export const sampleWithFullData: IChild = {
  id: 85561,
  firstName: 'Vickie',
  lastName: 'McDermott',
  gender: Gender['FEMALE'],
  age: 32830,
};

export const sampleWithNewData: NewChild = {
  firstName: 'Kenyatta',
  lastName: 'Wehner',
  gender: Gender['FEMALE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
