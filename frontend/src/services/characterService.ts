import { api } from './api';

export interface Character {
    id: string;
    novel_id: string;
    name: string;
    avatar?: string;
    personal_data: any;
    physical_appearance: any;
    psychology: any;
    goals: any;
    past: any;
    present: any;
    future: any;
    speech_patterns: any;
    relationships: any;
    additional_info: any;
    created_at: string;
    updated_at: string;
}

export interface CreateCharacterData {
    novel_id: string;
    name: string;
    avatar?: string;
    personal_data?: any;
    physical_appearance?: any;
    psychology?: any;
    goals?: any;
    past?: any;
    present?: any;
    future?: any;
    speech_patterns?: any;
    relationships?: any;
    additional_info?: any;
}

export const characterService = {
    async getByNovel(novelId: string): Promise<{ success: boolean; data: { characters: Character[]; total: number } }> {
        const response = await api.get(`/characters/novel/${novelId}`);
        return response.data;
    },

    async getById(id: string): Promise<{ success: boolean; data: Character }> {
        const response = await api.get(`/characters/${id}`);
        return response.data;
    },

    async create(data: CreateCharacterData): Promise<{ success: boolean; data: Character }> {
        const response = await api.post('/characters', data);
        return response.data;
    },

    async update(id: string, data: Partial<CreateCharacterData>): Promise<{ success: boolean; data: Character }> {
        const response = await api.put(`/characters/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/characters/${id}`);
        return response.data;
    }
};
