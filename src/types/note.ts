export type NoteTag =  'Todo' | 'Personal'| 'Work'| 'Meeting'| 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

 