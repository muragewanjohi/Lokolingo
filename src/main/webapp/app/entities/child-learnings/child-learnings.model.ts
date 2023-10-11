import dayjs from 'dayjs/esm';
import { IChild } from 'app/entities/child/child.model';
import { ILearning } from 'app/entities/learning/learning.model';

export interface IChildLearnings {
  id: number;
  active?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  child?: Pick<IChild, 'id'> | null;
  learning?: Pick<ILearning, 'id'> | null;
}

export type NewChildLearnings = Omit<IChildLearnings, 'id'> & { id: null };