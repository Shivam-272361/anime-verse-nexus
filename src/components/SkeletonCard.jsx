export default function SkeletonCard({ compact = false }) {
  return (
    <div className="rounded-[1.35rem]">
      <div className="block rounded-[1.25rem] bg-abyss p-[1px]">
        <div className="glass-strong overflow-hidden rounded-[1.2rem]">
          <div className={`${compact ? 'h-52' : 'h-72'} skeleton-shimmer relative`}>
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="mb-3 flex gap-2">
                <span className="h-6 w-16 rounded-full bg-white/[0.08]" />
                <span className="h-6 w-14 rounded-full bg-white/[0.08]" />
              </div>
              <div className="h-6 w-3/4 rounded-lg bg-white/[0.08]" />
              <div className="mt-3 flex items-center justify-between">
                <span className="h-4 w-12 rounded bg-white/[0.08]" />
                <span className="h-4 w-10 rounded bg-white/[0.08]" />
              </div>
            </div>
          </div>
          {!compact && (
            <div className="space-y-2 p-4">
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="skeleton-shimmer h-4 w-2/3 rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
