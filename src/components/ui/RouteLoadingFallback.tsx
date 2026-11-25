export function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="mx-auto flex min-h-[45vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 py-16 text-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#E2E8F0] dark:border-white/15 border-t-[#D5A83C]" />
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B] dark:text-[#859BB9]">
        Loading SK Tape Ball Academy...
      </p>
    </div>
  );
}
