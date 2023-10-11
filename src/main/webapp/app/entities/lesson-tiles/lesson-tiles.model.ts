import dayjs from 'dayjs/esm';
import { ILesson } from 'app/entities/lesson/lesson.model';
import { ITile } from 'app/entities/tile/tile.model';

export interface ILessonTiles {
  id: number;
  active?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  lesson?: Pick<ILesson, 'id'> | null;
  tile?: Pick<ITile, 'id'> | null;
}

export type NewLessonTiles = Omit<ILessonTiles, 'id'> & { id: null };
