import { fields, type Row, type Tab } from "@/lib/student-profile/model";
export const card =
  "rounded-2xl border border-[#c1c6d4]/70 bg-white p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md";
export const control =
  "mt-1 block w-full rounded-xl border border-[#c1c6d4] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[#004e99]";
export const button =
  "rounded-xl border border-[#c1c6d4] px-4 py-2 text-sm font-semibold hover:bg-[#edf5fc] disabled:opacity-50";
const choices: Record<string, string[]> = {
  Category: [
    "Technical skills",
    "Software and tools",
    "Programming languages",
    "Soft skills",
  ],
  Proficiency: ["Beginner", "Intermediate", "Advanced"],
  "Working arrangements": ["Remote", "Hybrid", "On-site"],
  "Working arrangement": ["Remote", "Hybrid", "On-site"],
  Duration: ["2–4 weeks", "4–8 weeks", "8–12 weeks"],
};
export function RecordFields({
  tab,
  row,
  update,
}: {
  tab: Tab;
  row: Row;
  update: (field: string, value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields[tab].map((field) => {
        const props = {
          className: control,
          value: row[field] ?? "",
          onChange: (
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >,
          ) => update(field, e.target.value),
        };
        const long = [
          "About me",
          "Description",
          "Short-term goals",
          "Long-term goals",
          "Practical interests",
        ].includes(field);
        return (
          <label
            key={field}
            className={`text-xs font-medium ${long || field === "Professional headline" ? "sm:col-span-2" : ""}`}
          >
            {field}
            {choices[field] ? (
              <select {...props}>
                <option value="">Select an option</option>
                {choices[field].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            ) : long ? (
              <textarea {...props} rows={3} maxLength={3000} />
            ) : (
              <input
                {...props}
                maxLength={3000}
                type={
                  field.endsWith("date")
                    ? "date"
                    : field === "Email"
                      ? "email"
                      : field === "Phone"
                        ? "tel"
                        : field === "Hours per week"
                          ? "number"
                          : "text"
                }
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
