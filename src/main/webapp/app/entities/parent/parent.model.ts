import { IUser } from 'app/entities/user/user.model';

export interface IParent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewParent = Omit<IParent, 'id'> & { id: null };
