import { api } from './api';

export interface Novel {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    cover_image?: string;
    word_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreateNovelData {
    title: string;
    description?: string;
    cover_image?: string;
}

export const novelService = {
    async getAll(): Promise<{ success: boolean; data: { novels: Novel[]; total: number } }> {
        const response = await api.get('/novels');
        return response.data;
    },

    async getById(id: string): Promise<{ success: boolean; data: Novel }> {
        const response = await api.get(`/novels/${id}`);
        return response.data;
    },

    async create(data: CreateNovelData): Promise<{ success: boolean; data: Novel }> {
        const response = await api.post('/novels', data);
        return response.data;
    },

    async update(id: string, data: Partial<CreateNovelData>): Promise<{ success: boolean; data: Novel }> {
        const response = await api.put(`/novels/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/novels/${id}`);
        return response.data;
    },

    async getStats(id: string): Promise<{ success: boolean; data: any }> {
        const response = await api.get(`/novels/${id}/stats`);
        return response.data;
    }
};
