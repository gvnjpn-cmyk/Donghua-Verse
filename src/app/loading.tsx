export default function Loading() {
  return (
    <div style={{ paddingTop: 68 }}>
      <div className="px-4 mb-5">
        <div className="skeleton h-7 w-48 rounded-xl mb-2" />
        <div className="skeleton h-4 w-32 rounded-lg" />
      </div>
      <div className="px-4 mb-6">
        <div className="skeleton h-10 rounded-2xl" />
      </div>
      {[1,2,3].map(s => (
        <div key={s} className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="skeleton h-6 w-40 rounded-lg" />
          </div>
          <div className="pl-4 flex gap-3">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="skeleton rounded-xl flex-shrink-0"
                style={{ width:110, height:155 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
