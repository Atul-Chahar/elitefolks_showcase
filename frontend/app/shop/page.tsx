import { getServerUser } from '../../lib/appwrite-server';
import { serverDbService } from '../../services/serverDbService';
import ShopModal from '../../components/ShopModal';
import { redirect } from 'next/navigation';

export default async function ShopPage() {
    const user = await getServerUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all data on the server for SSR
    const [shopItems, inventory, stats] = await Promise.all([
        serverDbService.getShopItems(),
        serverDbService.getInventory(user.id),
        serverDbService.getUserStats(user.id)
    ]);

    if (!stats) {
        // Handle error or redirect
        return <div>Error loading user stats.</div>;
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-0" aria-hidden="true" />

            <div className="relative z-10">
                <ShopModal
                    isOpen={true}
                    onClose={() => {}} // Redirection handled via Link or router in client components if needed
                    currentGems={stats.coins}
                    initialShopItems={shopItems}
                    initialInventory={inventory}
                    initialStats={stats}
                    activeTheme={stats.activeTheme}
                    onTransactionComplete={async () => {
                        'use server';
                        // Revalidation is handled by Server Actions
                    }}
                />
            </div>
        </div>
    );
}

