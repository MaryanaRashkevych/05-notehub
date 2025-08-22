import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteProp {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string = ""
): Promise<FetchNotesResponse> {
   const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: { page, perPage, search },
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  return response.data; 
}

export async function createNote(newNote: CreateNoteProp): Promise<Note> {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
}



