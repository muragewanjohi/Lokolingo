import { IParent } from 'app/entities/parent/parent.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IChild {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
  age?: number | null;
  parent?: Pick<IParent, 'id' | 'firstName' | 'lastName'> | null;
}

export type NewChild = Omit<IChild, 'id'> & { id: null };
