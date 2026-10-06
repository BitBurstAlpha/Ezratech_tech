"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/form-field";
import { adminDemoCredentials } from "@/lib/demo-state";
import { primaryButton } from "@/components/student/workspace/workspace-ui";
export function AdminDemoLogin() {
  const router = useRouter(); const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (data.get("email") !== adminDemoCredentials.email || data.get("password") !== adminDemoCredentials.password) { setError("Use the displayed demo credentials to enter this prototype."); return; }
    router.push("/admin/dashboard");
  }
  return <><div className="my-6 rounded-lg border border-border bg-blue-light p-4 text-xs leading-6"><p className="font-semibold text-primary">Admin Demo Credentials</p><p>Email: {adminDemoCredentials.email}</p><p>Password: {adminDemoCredentials.password}</p><p className="mt-2 text-muted">Simulated access only. No production authentication or account is created.</p></div><form onSubmit={submit} className="space-y-5"><FormField id="admin-demo-email" name="email" label="Email" type="email" defaultValue={adminDemoCredentials.email} required /><FormField id="admin-demo-password" name="password" label="Password" type="password" defaultValue={adminDemoCredentials.password} required />{error && <p role="alert" className="text-sm text-amber-800">{error}</p>}<button type="submit" className={`${primaryButton} w-full`}>Enter Admin Dashboard</button></form></>;
}
