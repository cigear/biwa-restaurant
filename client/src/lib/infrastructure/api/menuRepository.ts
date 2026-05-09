import type { MenuItem, Category } from '$domain/menu/models';

const API_BASE = 'http://192.168.11.51:3001';

export const menuRepository = {
    async getCategories(): Promise<Category[]> {
        const res = await fetch(`${API_BASE}/categories`);
        return res.json();
    },
    
    async getMenuItems(): Promise<MenuItem[]> {
        const res = await fetch(`${API_BASE}/menu`);
        return res.json();
    }
};