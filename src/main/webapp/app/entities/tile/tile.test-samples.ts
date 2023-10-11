import { LockedStatus } from 'app/entities/enumerations/locked-status.model';

import { ITile, NewTile } from './tile.model';

export const sampleWithRequiredData: ITile = {
  id: 53562,
  status: LockedStatus['UNLOCKED'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  languageTitle: 'pixel Arizona Analyst',
  englishTitle: 'Lead',
};

export const sampleWithPartialData: ITile = {
  id: 92249,
  status: LockedStatus['UNLOCKED'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  languageTitle: 'Response mobile',
  englishTitle: 'throughput',
};

export const sampleWithFullData: ITile = {
  id: 27486,
  status: LockedStatus['LOCKED'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  languageTitle: 'seamless Bedfordshire',
  englishTitle: 'Albania',
};

export const sampleWithNewData: NewTile = {
  status: LockedStatus['LOCKED'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  audio: '../fake-data/blob/hipster.png',
  audioContentType: 'unknown',
  languageTitle: 'South Movies Territories',
  englishTitle: 'Enterprise-wide Utah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
