import dayjs from 'dayjs/esm';
import { Language } from 'app/entities/enumerations/language.model';

export interface ILearning {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  language?: Language | null;
}

export type NewLearning = Omit<ILearning, 'id'> & { id: null };
