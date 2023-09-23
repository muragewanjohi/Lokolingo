import { ILearning } from 'app/shared/model/learning.model';
import { IParent } from 'app/shared/model/parent.model';
import { Gender } from 'app/shared/model/enumerations/gender.model';

export interface IChild {
  id?: number;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  age?: number | null;
  learning?: ILearning | null;
  parent?: IParent | null;
}

export const defaultValue: Readonly<IChild> = {};
