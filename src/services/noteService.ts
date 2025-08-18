import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string = ""
): Promise<FetchNotesResponse> {
  const response = await axios.get(`${BASE_URL}/notes`, {
    params: { page, perPage, search },
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const notes: Note[] = response.data.notes; 
  const totalPages: number = response.data.totalPages;
  const currentPage: number = response.data.page;
  const total: number = response.data.total;

  return { notes, page: currentPage, perPage, total, totalPages };
}

export interface CreateNoteProp {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(newNote: CreateNoteProp): Promise<Note> {
  const response = await axios.post(`${BASE_URL}/notes`, newNote, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<{ id: string }> {
  const response = await axios.delete(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
}
