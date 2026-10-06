import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function FormField({ id, label, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        {...props}
        id={id}
        className="h-12 w-full rounded-lg border border-border bg-white px-3.5 text-base text-ink transition-colors placeholder:text-muted/60 hover:border-primary/40 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary/20"
      />
    </div>
  );
}
