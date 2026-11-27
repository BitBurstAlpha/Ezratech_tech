import type { Profile } from "@/lib/student-profile/model";
import { card, control } from "./profile-fields";
export function PrivacySettings({
  busy,
  profile,
  setDraft,
}: {
  busy: boolean;
  profile: Profile;
  setDraft: (p: Profile) => void;
}) {
  return (
    <fieldset disabled={busy} className={card + " space-y-4 text-sm"}>
      <h3 className="border-b border-slate-200 pb-3 font-bold">
        Profile Settings &amp; Privacy
      </h3>
      {(["visibility", "cvVisibility"] as const).map((k) => (
        <label key={k} className="block">
          {k === "visibility" ? "Profile visibility" : "CV visibility"}
          <select
            className={control}
            value={profile[k]}
            onChange={(e) => setDraft({ ...profile, [k]: e.target.value })}
          >
            {(k === "visibility"
              ? [
                  "Approved SMEs & Mentors",
                  "EzraTech Advisors Only",
                  "Private (Draft)",
                ]
              : ["Hidden", "Approved SMEs on Shortlist", "All Approved SMEs"]
            ).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      ))}
      {(["shareContact", "sharing"] as const).map((k) => (
        <label
          key={k}
          className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
        >
          {k === "sharing"
            ? "SME profile sharing permission"
            : "Show contact information to matched SMEs"}
          <input
            type="checkbox"
            checked={profile[k]}
            onChange={(e) => setDraft({ ...profile, [k]: e.target.checked })}
          />
        </label>
      ))}
      <p className="text-xs text-slate-600">
        Profile photo uploads are unavailable until secure storage is
        configured.
      </p>
    </fieldset>
  );
}
