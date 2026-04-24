export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans pt-32 pb-24 px-4">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Skeleton */}
                <header className="text-center mb-24 relative flex flex-col items-center">
                    <div className="w-48 h-8 rounded-full bg-white/5 mb-6 animate-pulse" />
                    <div className="w-3/4 max-w-2xl h-16 bg-white/5 rounded-lg mb-6 animate-pulse" />
                    <div className="w-1/2 max-w-xl h-6 bg-white/5 rounded-lg mt-8 animate-pulse" />
                </header>

                {/* Courses Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[420px] bg-white/[0.02] border border-white/5 rounded-[2rem] p-7 flex flex-col animate-pulse">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/10" />
                                <div className="w-20 h-6 rounded-full bg-white/10" />
                            </div>
                            <div className="space-y-4 mb-auto">
                                <div className="w-3/4 h-8 bg-white/10 rounded" />
                                <div className="w-full h-4 bg-white/10 rounded" />
                                <div className="w-5/6 h-4 bg-white/10 rounded" />
                            </div>
                            <div className="mt-8 space-y-3">
                                <div className="w-full h-12 rounded-xl bg-white/10" />
                                <div className="w-full h-10 rounded-xl bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
