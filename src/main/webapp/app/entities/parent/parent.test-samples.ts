import { IParent, NewParent } from './parent.model';

export const sampleWithRequiredData: IParent = {
  id: 76908,
  firstName: 'Arnulfo',
  lastName: 'Watsica',
  email: '507~@Z.&',
  phone: '(944) 233-2244',
};

export const sampleWithPartialData: IParent = {
  id: 70252,
  firstName: 'Stephan',
  lastName: 'Runte',
  email: 'nywl@).Jml',
  phone: '(795) 696-1423 x575',
};

export const sampleWithFullData: IParent = {
  id: 72572,
  firstName: 'Anthony',
  lastName: 'Gottlieb',
  email: '4IS_L/@f%Ukwd.;p',
  phone: '(967) 424-2771 x532',
};

export const sampleWithNewData: NewParent = {
  firstName: 'Clara',
  lastName: 'Stehr',
  email: 'j35$#@Jbnr.(K:v',
  phone: '859.951.5095 x661',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
