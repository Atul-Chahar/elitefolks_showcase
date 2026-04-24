import { createMockProxy } from '../../lib/mockProxy';
export const purchaseItem = createMockProxy('purchaseItem');
export async function buyItem() { return { success: true } }
export const buyShopItem = createMockProxy('buyShopItem');
export const sellShopItem = createMockProxy('sellShopItem');
export const equipShopTheme = createMockProxy('equipShopTheme');
export const useShopItem = createMockProxy('useShopItem');
