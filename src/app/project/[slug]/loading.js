export default function ProjectLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 animate-pulse">
        {/* Back link */}
        <div className="glass rounded-full h-4 w-28 mb-8" />
        {/* Category chip */}
        <div className="glass rounded-full h-7 w-32 mb-5" />
        {/* Title */}
        <div className="glass rounded-2xl h-16 md:h-24 w-3/4 mb-3" />
        <div className="glass rounded-xl h-6 w-48 mb-8" />
        {/* Hero image */}
        <div className="glass rounded-3xl aspect-[16/9] mb-10" />
        {/* Body */}
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-3">
            <div className="glass rounded-lg h-4 w-full" />
            <div className="glass rounded-lg h-4 w-11/12" />
            <div className="glass rounded-lg h-4 w-4/5" />
            <div className="glass rounded-lg h-4 w-2/3" />
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-2 content-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-full h-8 w-20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
