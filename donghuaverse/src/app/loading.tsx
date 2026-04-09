export default function Loading() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero skeleton */}
      <div className="skeleton w-full h-[72vh] min-h-[500px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {[1, 2, 3].map((s) => (
          <section key={s}>
            <div className="skeleton h-7 w-48 rounded-lg mb-4" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton rounded-xl flex-shrink-0"
                  style={{ width: 160, height: 240 }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
