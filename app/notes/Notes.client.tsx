"use client";

import css from "./page.module.css";
import { useState } from "react";
import NoteList from "../../components/NoteList/NoteList";
import { FetchNotes } from "../../lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../../components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";

export default function NotesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearchWord = useDebouncedCallback((searchWord: string) => {
    setSearchValue(searchWord);
    setPage(1);
  }, 500);

  const { data, isSuccess } = useQuery({
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

      {data !== undefined && data?.notes.length > 0 && (
        <NoteList notes={data?.notes} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
