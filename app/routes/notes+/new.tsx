import { getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";
import { Field, TextareaField } from "~/components/forms.tsx";
import { createNote } from "~/utils/note.server.ts";
import { requireUserId } from "~/utils/session.server.ts";

const NewNoteSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: NewNoteSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, body } = submission.value;
  const note = await createNote({ body, title, userId });

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    id: "note-form",
    constraint: getZodConstraint(NewNoteSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NewNoteSchema });
    },
    shouldRevalidate: "onBlur",
  });

  useEffect(() => {
    if (fields.title.errors) {
      titleRef.current?.focus();
    } else if (fields.body.errors) {
      bodyRef.current?.focus();
    }
  }, [fields]);

  return (
    <Form
      id={form.id}
      aria-invalid={form.errors ? true : undefined}
      aria-describedby={form.errors ? form.errorId : undefined}
      method="post"
      className="flex flex-col gap-2 w-full"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <Field
        labelProps={{ children: "Title:" }}
        inputProps={{ ...getInputProps(fields.title, { type: "text" }) }}
        field={fields.title}
      />

      <TextareaField
        labelProps={{ children: "Body:" }}
        textareaProps={{ ...getTextareaProps(fields.body) }}
        field={fields.body}
      />

      <div className="text-right">
        <Button type="submit"> Save</Button>
      </div>
    </Form>
  );
}
