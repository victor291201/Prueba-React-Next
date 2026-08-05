export function ProductListSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="mb-3 h-4 w-20 rounded bg-slate-200 dark:bg-neutral-700" />
          <div className="mb-4 h-5 w-40 rounded bg-slate-200 dark:bg-neutral-700" />
          <div className="mb-2 h-3 w-full rounded bg-slate-100 dark:bg-neutral-800" />
          <div className="mb-2 h-3 w-3/4 rounded bg-slate-100 dark:bg-neutral-800" />
          <div className="mb-4 h-3 w-1/2 rounded bg-slate-100 dark:bg-neutral-800" />
          <div className="flex justify-between">
            <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-neutral-700" />
            <div className="h-4 w-24 rounded bg-slate-100 dark:bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
