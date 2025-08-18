 import { useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./NoteList.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Note } from "../../types/note";

interface NoteListProps {
  page: number;
  perPage: number;
  search?: string;
  onDelete: (id: string) => void;
  onTotalPages: (total: number) => void;
}

export default function NoteList({ page, perPage, search="", onDelete, onTotalPages }: NoteListProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, perPage, search),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.totalPages) {
      onTotalPages(data.totalPages);
    }
  }, [data, onTotalPages]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

   const notes: Note[] = data?.notes ?? [];

  if (notes.length === 0) {
    return <p className={css.empty}>There are no notes yet. Please create one!</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
