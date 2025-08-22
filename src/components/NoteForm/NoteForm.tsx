import { Formik, Form, Field, ErrorMessage as FormikError} from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import type { CreateNoteProp } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps {
    onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: CreateNoteProp) => createNote(values),
    onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (err) => {
      console.error("Failed to create note:", err);
    },
  });

  const initialValues: CreateNoteProp = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values: CreateNoteProp, { resetForm }) => {
        createMutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }: { isSubmitting: boolean }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
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
            <FormikError name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}























// import { Formik, Form, Field, ErrorMessage as FormikError, type FormikHelpers } from "formik";
// import * as Yup from "yup";
// import css from "./NoteForm.module.css";
// import type { NoteTag } from "../../types/note";
// import type { CreateNoteProp } from "../../services/noteService";

// interface NoteFormProps {
//   onSubmit: (values: CreateNoteProp) => void;
//   onCancel: () => void;
// }
// const NoteSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Title must be at least 3 characters")
//     .max(50, "Title must be at most 50 characters")
//     .required("Title is required"),
//   content: Yup.string()
//     .max(500, "Content must be at most 500 characters"),
//   tag: Yup.mixed<NoteTag>()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
//     .required("Tag is required"),
// });

// export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
//   const initialValues: CreateNoteProp = {
//     title: "",
//     content: "",
//     tag: "Todo",
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={NoteSchema}
//       onSubmit={(values: CreateNoteProp, { resetForm }: FormikHelpers<CreateNoteProp>) => {
//         onSubmit(values);
//         resetForm();
//       }}
//     >
//       {({ isSubmitting }: { isSubmitting: boolean }) => (
//         <Form className={css.form}>
//           <div className={css.formGroup}>
//             <label htmlFor="title">Title</label>
//             <Field id="title" name="title" type="text" className={css.input} />
//             <FormikError name="title" component="span" className={css.error} />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor="content">Content</label>
//             <Field
//               as="textarea"
//               id="content"
//               name="content"
//               rows={8}
//               className={css.textarea}
//             />
//             <FormikError name="content" component="span" className={css.error} />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor="tag">Tag</label>
//             <Field as="select" id="tag" name="tag" className={css.select}>
//               <option value="Todo">Todo</option>
//               <option value="Work">Work</option>
//               <option value="Personal">Personal</option>
//               <option value="Meeting">Meeting</option>
//               <option value="Shopping">Shopping</option>
//             </Field>
//             <FormikError name="tag" component="span" className={css.error} />
//           </div>

//           <div className={css.actions}>
//             <button type="button" className={css.cancelButton} onClick={onCancel}>
//               Cancel
//             </button>
//             <button type="submit" className={css.submitButton} disabled={isSubmitting}>
//               Create note
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// }
