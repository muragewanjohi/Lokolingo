import { IChild } from 'app/shared/model/child.model';

export interface IParent {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  children?: IChild[] | null;
}

export const defaultValue: Readonly<IParent> = {};
