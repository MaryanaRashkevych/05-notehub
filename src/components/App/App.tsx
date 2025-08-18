import { useState } from "react";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { createNote, deleteNote, type CreateNoteProp } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const perPage = 12;

  const queryClient = useQueryClient();

    const createMutation = useMutation({
  mutationFn: (values: CreateNoteProp) => createNote(values),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes", page] });
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
 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
          <SearchBox onSearch={setSearchTerm} />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        <button className={css.button} onClick={openModal}>
          Create NOTE +
        </button>
      </header>

      <main>
       <NoteList
          page={page}
          perPage={perPage}
          search={debouncedSearchTerm} 
          onDelete={(id) => deleteMutation.mutate(id)}
          onTotalPages={setTotalPages}
        />
       
      </main>

      {isModalOpen && (
        <NoteModal onClose={closeModal}>
          <NoteForm onSubmit={handleCreateNote} onCancel={closeModal} />
        </NoteModal>
      )}
    </div>
  );
}

 