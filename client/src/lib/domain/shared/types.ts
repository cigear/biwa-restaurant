// src/lib/domain/shared/types.ts

/** 货币金额值对象，确保精度 */
export type Money = {
    amount: number;
    currency: 'JPY' | 'CNY' | 'USD';
};

/** 多语言文案 Key */
export type Translatable = string; 

/** 订单状态枚举 */
export enum OrderStatus {
    Pending = 'pending',    // 待处理
    Confirmed = 'confirmed', // 已确认/制作中
    Served = 'served',       // 已上菜
    Completed = 'completed', // 已完成/已结账
    Cancelled = 'cancelled'  // 已取消
}

