export interface IQuestion {
  id: number;
  description?: string | null;
  audio?: string | null;
  audioContentType?: string | null;
  audioDescription?: string | null;
}

export type NewQuestion = Omit<IQuestion, 'id'> & { id: null };
