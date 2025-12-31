import { api } from './api';

export interface Scene {
    id: string;
    novel_id: string;
    scene_number: number;
    location: string;
    time_of_day: 'day' | 'night' | 'dawn' | 'dusk';
    characters: string[];
    pov: string;
    objective: string;
    description: string;
    language_features: string[];
    themes: string[];
    dramatic_beats: any;
    plot_connection: string;
    emotional_state: string;
    notes: string;
    status: 'draft' | 'complete' | 'revision';
    created_at: string;
    updated_at: string;
}

export interface CreateSceneData {
    novel_id: string;
    scene_number: number;
    location?: string;
    time_of_day?: 'day' | 'night' | 'dawn' | 'dusk';
    characters?: string[];
    pov?: string;
    objective?: string;
    description?: string;
    language_features?: string[];
    themes?: string[];
    dramatic_beats?: any;
    plot_connection?: string;
    emotional_state?: string;
    notes?: string;
    status?: 'draft' | 'complete' | 'revision';
}

export const sceneService = {
    async getByNovel(novelId: string): Promise<{ success: boolean; data: { scenes: Scene[]; total: number } }> {
        const response = await api.get(`/scenes/novel/${novelId}`);
        return response.data;
    },

    async create(data: CreateSceneData): Promise<{ success: boolean; data: Scene }> {
        const response = await api.post('/scenes', data);
        return response.data;
    },

    async update(id: string, data: Partial<CreateSceneData>): Promise<{ success: boolean; data: Scene }> {
        const response = await api.put(`/scenes/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/scenes/${id}`);
        return response.data;
    }
};

export const timeOfDayOptions = [
    { value: 'day', label: 'Día', icon: '☀️' },
    { value: 'night', label: 'Noche', icon: '🌙' },
    { value: 'dawn', label: 'Amanecer', icon: '🌅' },
    { value: 'dusk', label: 'Atardecer', icon: '🌆' }
];

export const statusOptions = [
    { value: 'draft', label: 'Borrador', color: 'gray' },
    { value: 'complete', label: 'Completa', color: 'green' },
    { value: 'revision', label: 'Revisión', color: 'orange' }
];
