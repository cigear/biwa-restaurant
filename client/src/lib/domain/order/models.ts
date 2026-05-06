// src/lib/domain/order/models.ts
import type { MenuItem, ProductChoice } from '../menu/models';
import type { Money, OrderStatus } from '../shared/types';

export interface OrderItem {
    id: string; // 唯一标识，区分同一商品的不同规格
    productId: string;
    productNameKey: string;
    basePrice: Money;
    selectedChoices: ProductChoice[];
    quantity: number;
    totalPrice: Money; // 计算后的单项总价
}

export interface Order {
    id: string;
    tableNumber: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: Date;
    totalAmount: Money;
    notes?: string;
}