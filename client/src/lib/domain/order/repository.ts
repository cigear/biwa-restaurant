// src/lib/domain/order/repository.ts
import type { Order } from './models';

export interface IOrderRepository {
    submitOrder(order: Order): Promise<boolean>;
    getOrderById(id: string): Promise<Order | null>;
    getActiveOrdersByTable(tableNumber: string): Promise<Order[]>;
}
