import { useInputControl, type FieldMetadata } from "@conform-to/react";
import React from "react";

import { Checkbox, type CheckboxProps } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

type FieldProps = {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  field: FieldMetadata<string, Record<string, unknown>>;
};

type TextareaFieldProps = {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  textareaProps: React.InputHTMLAttributes<HTMLTextAreaElement>;
  className?: string;
  field: FieldMetadata<string, Record<string, unknown>>;
};

type CheckboxFieldProps = {
  labelProps: JSX.IntrinsicElements["label"];
  checkboxProps: CheckboxProps;
  className?: string;
  field: FieldMetadata<string, Record<string, unknown>>;
};

export type ListOfErrors = (string | null | undefined)[] | null | undefined;

export function ErrorList({
  id,
  errors,
}: {
  errors?: ListOfErrors;
  id?: string;
}) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul id={id} className="flex flex-col gap-1">
      {errorsToRender.map((e) => (
        <li key={e} className="text-[10px] text-foreground-danger">
          {e}
        </li>
      ))}
    </ul>
  );
}

export function Field({
  labelProps,
  inputProps,
  className,
  field,
}: FieldProps) {
  const { errorId, errors } = field;

  return (
    <div className={className}>
      <Label
        className="block text-sm font-medium text-gray-700"
        htmlFor={inputProps.id}
        {...labelProps}
      />
      <div className="mt-1">
        <Input
          {...inputProps}
          aria-describedby={errorId}
          aria-invalid={errors ? true : undefined}
        />
        {errors ? (
          <div id={errorId} className="pt-1 text-red-700">
            {errors}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TextareaField({
  labelProps,
  textareaProps,
  className,
  field,
}: TextareaFieldProps) {
  const { errorId, errors } = field;

  return (
    <div className={className}>
      <Label
        className="block text-sm font-medium text-gray-700"
        htmlFor={textareaProps.id}
        {...labelProps}
      />
      <div className="mt-1">
        <Textarea
          {...textareaProps}
          aria-describedby={errorId}
          aria-invalid={errors ? true : undefined}
        />
        {errors ? (
          <div id={errorId} className="pt-1 text-red-700">
            {errors}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CheckboxField({
  labelProps,
  checkboxProps,
  className,
  field,
}: CheckboxFieldProps) {
  const { errorId, errors } = field;
  const control = useInputControl(field);

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Checkbox
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...checkboxProps}
          onFocus={(event) => {
            control.focus();
            checkboxProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            control.blur();
            checkboxProps.onBlur?.(event);
          }}
          type="button"
        />
        <Label
          htmlFor={checkboxProps.id}
          {...labelProps}
          className="self-center text-body-xs text-muted-foreground"
        />
      </div>
      {errorId ? (
        <div className="px-4 pb-3 pt-1">
          <ErrorList id={errorId} errors={errors} />
        </div>
      ) : null}
    </div>
  );
}
