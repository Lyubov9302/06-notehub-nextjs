import css from "./NoteList.module.css";
import { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const QueryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => DeleteNote(id),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  function handleDelete(id: string) {
    deleteNoteMutation.mutate(id);
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          key={note.id}
          className={css.listItem}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
