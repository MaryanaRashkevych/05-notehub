export type NoteTag =  'Todo' | 'Personal'| 'Work'| 'Meeting'| 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  data: Note[];
}

 