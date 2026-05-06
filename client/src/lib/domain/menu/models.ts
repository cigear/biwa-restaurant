// src/lib/domain/menu/models.ts
import type { Money, Translatable } from '../shared/types';

export interface Category {
    id: string;
    nameKey: Translatable; // 对应 i18n JSON 中的 Key
    sortOrder: number;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    nameKey: Translatable;
    descriptionKey?: Translatable;
    basePrice: Money;
    imageUrl?: string;
    options: ProductOption[];
    isAvailable: boolean;
}

export interface ProductOption {
    id: string;
    nameKey: Translatable;
    required: boolean;
    choices: ProductChoice[];
}

export interface ProductChoice {
    id: string;
    nameKey: Translatable;
    extraPrice?: Money;
}

