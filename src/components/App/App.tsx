import { useState } from "react";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { createNote, deleteNote, fetchNotes, type CreateNoteProp } from "../../services/noteService";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const perPage = 12;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () => fetchNotes(page, perPage, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateNoteProp) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", page, debouncedSearchTerm] });
      closeModal();
    },
    onError: (err) => {
      console.error("Failed to create note:", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      console.error("Failed to delete note:", err);
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleCreateNote = (values: CreateNoteProp) => createMutation.mutate(values);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

 if (isLoading) return <Loader />; 
  if (isError) return <ErrorMessage />;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create NOTE +
        </button>
      </header>

      <main>
        {notes.length === 0 ? (
          <p className={css.empty}>There are no notes yet. Please create one!</p>
        ) : (
          <NoteList
            notes={notes}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </main>

      {isModalOpen && (
        <NoteModal onClose={closeModal}>
          <NoteForm onSubmit={handleCreateNote} onCancel={closeModal} />
        </NoteModal>
      )}
    </div>
  );
}