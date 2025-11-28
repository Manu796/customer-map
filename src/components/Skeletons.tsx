// Skeleton loader components for better loading UX

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="w-full px-3 sm:px-4 py-3 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        </div>
        <div className="flex gap-1">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonQuickAction() {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}
