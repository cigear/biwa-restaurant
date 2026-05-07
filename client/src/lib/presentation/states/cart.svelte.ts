import type { OrderItem } from '$domain/order/models';
import type { MenuItem } from '$domain/menu/models';

class CartState {
    items = $state<OrderItem[]>([]);
    
    // 添加控制 UI 显隐的状态
    isOpen = $state(false);

    // 辅助私有方法：从可能不规范的数据中提取金额
    #getAmount(price: any): number {
        if (typeof price === 'object' && price !== null) {
            return Number(price.amount ?? 0);
        }
        return Number(price ?? 0);
    }

    // 1. 修改计算属性：返回一致的 Money 结构
    get totalPrice() {
        const total = this.items.reduce((sum, item) => {
            const price = this.#getAmount(item.basePrice);
            return sum + (price * item.quantity);
        }, 0);
        return { amount: total, currency: 'JPY' as const };
    }

    get totalCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    addItem(product: MenuItem) {
        const existing = this.items.find(i => i.productId === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            // 2. 规范化存储：确保 basePrice 始终包含 amount
            const priceObj = typeof product.basePrice === 'object' && product.basePrice !== null 
                ? { ...product.basePrice } 
                : { amount: Number(product.basePrice ?? 0), currency: 'JPY' as const };

            this.items.push({
                id: crypto.randomUUID(),
                productId: product.id,
                productNameKey: product.nameKey,
                basePrice: priceObj,
                quantity: 1,
                selectedChoices: [],
                totalPrice: { ...priceObj }
            });
        }
    }

    removeItem(itemId: string) {
        this.items = this.items.filter(i => i.id !== itemId);
    }

    updateQuantity(itemId: string, delta: number) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQty;
                // 3. 同步更新单项总价
                const unitPrice = this.#getAmount(item.basePrice);
                item.totalPrice.amount = unitPrice * item.quantity;
            }
        }
    }

    // 辅助方法：方便一键切换
    toggleDrawer() {
        this.isOpen = !this.isOpen;
    }

    // 清空购物车
    clear() {
        this.items = [];
    }
}

export const cart = new CartState();