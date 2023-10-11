export interface IParent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
}

export type NewParent = Omit<IParent, 'id'> & { id: null };
