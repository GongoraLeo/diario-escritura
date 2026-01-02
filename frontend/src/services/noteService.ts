import { api } from './api';

export interface Note {
    id: string;
    novel_id: string;
    type: 'style' | 'plot';
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CreateNoteData {
    novel_id: string;
    type: 'style' | 'plot';
    title: string;
    content?: string;
}

export const noteService = {
    async getByNovel(novelId: string, type?: 'style' | 'plot'): Promise<{ success: boolean; data: { notes: Note[]; total: number } }> {
        const response = await api.get(`/notes/novel/${novelId}`, { params: { type } });
        return response.data;
    },

    async create(data: CreateNoteData): Promise<{ success: boolean; data: Note }> {
        const response = await api.post('/notes', data);
        return response.data;
    },

    async update(id: string, data: Partial<CreateNoteData>): Promise<{ success: boolean; data: Note }> {
        const response = await api.put(`/notes/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    }
};
