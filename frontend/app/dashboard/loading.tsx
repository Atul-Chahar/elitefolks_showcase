export default function DashboardLoading() {
    return (
        <div className="flex h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Sidebar Skeleton */}
            <div className="w-20 lg:w-64 border-r border-white/5 bg-zinc-950 flex flex-col items-center lg:items-start transition-all duration-300 relative z-20">
                <div className="p-4 lg:p-6 w-full mb-8">
                    <div className="w-10 h-10 lg:w-full lg:h-12 bg-white/5 rounded-xl animate-pulse" />
                </div>

                <div className="flex-1 w-full flex flex-col gap-2 px-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-14 lg:w-full h-12 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>

                <div className="p-4 mt-auto w-full border-t border-white/5">
                    <div className="w-12 h-12 lg:w-full lg:h-14 bg-white/5 rounded-xl animate-pulse mx-auto" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                <div className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
                        {/* Header State */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                            <div className="space-y-4">
                                <div className="w-48 h-10 bg-white/5 rounded-lg animate-pulse" />
                                <div className="w-72 h-6 bg-white/5 rounded-lg animate-pulse" />
                            </div>
                            <div className="w-32 h-10 bg-white/5 rounded-lg animate-pulse" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-28 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                            ))}
                        </div>

                        {/* Recent Activity Map */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 animate-pulse h-64 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
