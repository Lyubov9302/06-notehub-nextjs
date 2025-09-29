import css from "./App.module.css";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import { Toaster } from "react-hot-toast";
import { FetchNotes } from "../../services/noteService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearchWord = useDebouncedCallback((searchWord: string) => {
    setSearchValue(searchWord);
    setPage(1);
  }, 500);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", searchValue, page],
    queryFn: () => FetchNotes(searchValue, page),
    placeholderData: keepPreviousData,
  });

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchWord} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
        <button
          className={css.button}
          onClick={openModal}
        >
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage text="Error, please try again" />}
      {data !== undefined && data?.notes.length === 0 && (
        <ErrorMessage text="No notes found" />
      )}
      {data !== undefined && data?.notes.length > 0 && (
        <NoteList notes={data?.notes} />
      )}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          children={<NoteForm onClose={closeModal} />}
        />
      )}
      <Toaster />
    </div>
  );
}
