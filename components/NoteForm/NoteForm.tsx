import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { CreateNote } from "../../lib/api";
import { CreateNoteRequest } from "../../types/note";

interface NoteFormProps {
  onClose: () => void;
}

const defaultValues: CreateNoteRequest = {
  title: "",
  content: "",
  tag: "Todo",
};

const OrderSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const QueryClient = useQueryClient();

  const createNoteMutate = useMutation({
    mutationFn: (data: CreateNoteRequest) => CreateNote(data),
    onSuccess() {
      QueryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: CreateNoteRequest,
    formikHelpers: FormikHelpers<CreateNoteRequest>
  ) => {
    createNoteMutate.mutate(values, {
      onSuccess: () => formikHelpers.resetForm(),
    });
  };

  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={handleSubmit}
      validationSchema={OrderSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage
            component="span"
            name="title"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            component="span"
            name="content"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            as="select"
            id="tag"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            component="span"
            name="tag"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={false}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
