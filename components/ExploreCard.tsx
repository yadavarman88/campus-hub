import Link from "next/link";

type Props = {
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

export default function ExploreCard({
  href,
  eyebrow,
  title,
  subtitle,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/80">
            {eyebrow}
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/10 group-hover:text-orange-500 dark:border-gray-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M4 10h11M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}