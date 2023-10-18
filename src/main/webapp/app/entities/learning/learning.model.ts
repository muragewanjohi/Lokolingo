import dayjs from 'dayjs/esm';
import { ILesson } from 'app/entities/lesson/lesson.model';

export interface ILearning {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  lesson?: Pick<ILesson, 'id' | 'title'> | null;
}

export type NewLearning = Omit<ILearning, 'id'> & { id: null };
