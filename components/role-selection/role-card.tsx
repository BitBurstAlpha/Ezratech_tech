import Link from "next/link";
import { Icon, type IconName } from "@/components/landing/icon";

type RoleCardProps = {
  title: string;
  description: string;
  points: readonly string[];
  buttonLabel: string;
  href: string;
  icon: IconName;
};

export function RoleCard({ title, description, points, buttonLabel, href, icon }: RoleCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-white p-7 shadow-[0_3px_16px_rgba(51,52,56,0.04)] sm:p-9">
      <span className="relative mb-6 grid h-14 w-14 place-items-center rounded-xl bg-blue-light text-primary">
        <Icon name={icon} className="h-7 w-7" />
        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
      </span>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{description}</p>
      <ul className="my-7 space-y-4 border-t border-border pt-6">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm leading-6">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mt-1 h-4 w-4 shrink-0 text-primary">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
      <Link href={href} prefetch={false} className="mt-auto inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
        {buttonLabel}
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </article>
  );
}
