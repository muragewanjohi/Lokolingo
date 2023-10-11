import dayjs from 'dayjs/esm';
import { ISubject } from 'app/entities/subject/subject.model';
import { ILesson } from 'app/entities/lesson/lesson.model';

export interface ISubjectLessons {
  id: number;
  active?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  subject?: Pick<ISubject, 'id'> | null;
  lesson?: Pick<ILesson, 'id'> | null;
}

export type NewSubjectLessons = Omit<ISubjectLessons, 'id'> & { id: null };
