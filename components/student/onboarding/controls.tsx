import type { SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
const controlStyle = "w-full rounded-lg border border-border bg-white px-3.5 py-3 text-base text-ink hover:border-primary/40 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary/20";
export function SelectField({ id, label, options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string; options: string[] }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label><select id={id} {...props} className={controlStyle}><option value="">Select an option</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></div>;
}
export function TextareaField({ id, label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label><textarea id={id} rows={3} {...props} className={`${controlStyle} resize-y`} /></div>;
}
export function Choice({ label, selected, onChange, type = "checkbox", name }: { label: string; selected: boolean; onChange: () => void; type?: "checkbox" | "radio"; name?: string }) {
  return <label className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6 transition-colors ${selected ? "border-primary bg-blue-light text-primary" : "border-border bg-white hover:border-primary/40"}`}><input type={type} name={name} checked={selected} onChange={onChange} className="mt-1 h-4 w-4 shrink-0 accent-primary" />{label}</label>;
}
