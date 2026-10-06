"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/form-field";
import { Icon } from "@/components/landing/icon";

import { useDemoProgress } from "./progress/demo-progress";

type Notice = "terms" | "privacy" | "login";
const notices = {
  terms: { title: "Terms of Use", copy: "The Terms of Use will be available in the proposed EzraTech platform. This prototype does not create an account or enter you into an agreement." },
  privacy: { title: "Privacy Notice", copy: "The Privacy Notice will be available in the proposed EzraTech platform. Details entered in this demo are not submitted or stored by EzraTech." },
  login: { title: "Log in to EzraTech", copy: "The login screen will be part of the proposed platform. Account access is not available in this clickable prototype." },
};

export function RegistrationForm() {
  const router = useRouter();
  const { dispatch } = useDemoProgress();
  const dialog = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState<Notice>("terms");

  function checkPasswords(form: HTMLFormElement) {
    const password = form.querySelector<HTMLInputElement>("#password");
    const confirmation = form.querySelector<HTMLInputElement>("#confirm-password");
    if (confirmation) {
      confirmation.setCustomValidity(
        confirmation.value && confirmation.value !== password?.value
          ? "Passwords must match."
          : "",
      );
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    checkPasswords(form);
    if (!form.reportValidity()) return;
    dispatch({ type: "registerStudent" });
    form.reset();
    router.push("/student/onboarding");
  }

  function showNotice(kind: Notice) {
    setNotice(kind);
    dialog.current?.showModal();
  }

  return (
    <>
      <form onSubmit={submit} onInput={(event) => checkPasswords(event.currentTarget)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="first-name" label="First Name" autoComplete="given-name" required />
          <FormField id="last-name" label="Last Name" autoComplete="family-name" required />
        </div>
        <div className="mt-5 space-y-5">
          <FormField id="email" label="Email Address" type="email" autoComplete="email" required />
          <FormField id="password" label="Password" type="password" autoComplete="new-password" required />
          <FormField id="confirm-password" label="Confirm Password" type="password" autoComplete="new-password" required />
        </div>
        <div className="my-6 flex items-start gap-3">
          <input id="agreement" type="checkbox" aria-label="I agree to the Terms of Use and Privacy Notice" required className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary" />
          <div className="text-sm leading-6 text-muted">
            <label htmlFor="agreement">I agree to the </label>
            <button type="button" onClick={() => showNotice("terms")} className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-hover">Terms of Use</button>
            <label htmlFor="agreement"> and </label>
            <button type="button" onClick={() => showNotice("privacy")} className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-hover">Privacy Notice</button>
          </div>
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
          Create Account <Icon name="arrow" className="h-4 w-4" />
        </button>
        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <button type="button" onClick={() => showNotice("login")} className="font-semibold text-primary hover:text-primary-hover">Log in</button>
        </p>
      </form>
      <dialog ref={dialog} aria-labelledby="registration-notice-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-white p-7 text-ink shadow-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">EzraTech preview</p>
        <h2 id="registration-notice-title" className="text-2xl font-semibold">{notices[notice].title}</h2>
        <p className="mt-4 text-sm leading-6 text-muted">{notices[notice].copy}</p>
        <button type="button" onClick={() => dialog.current?.close()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">Back to registration</button>
      </dialog>
    </>
  );
}
