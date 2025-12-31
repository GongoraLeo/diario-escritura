import { api } from './api';

export interface TimelineTrack {
    id: string;
    novel_id: string;
    name: string;
    color: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface TimelineEvent {
    id: string;
    track_id: string;
    title: string;
    description: string;
    start_position: number; // Posición en el timeline (0-100%)
    duration: number; // Duración en porcentaje (0-100%)
    color?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTrackData {
    novel_id: string;
    name: string;
    color?: string;
    order?: number;
}

export interface CreateEventData {
    track_id: string;
    title: string;
    description?: string;
    start_position: number;
    duration?: number;
    color?: string;
}

export const timelineService = {
    // Tracks
    async getTracksByNovel(novelId: string): Promise<{ success: boolean; data: { tracks: TimelineTrack[]; total: number } }> {
        const response = await api.get(`/timeline/novel/${novelId}/tracks`);
        return response.data;
    },

    async createTrack(data: CreateTrackData): Promise<{ success: boolean; data: TimelineTrack }> {
        const response = await api.post('/timeline/tracks', data);
        return response.data;
    },

    async updateTrack(id: string, data: Partial<CreateTrackData>): Promise<{ success: boolean; data: TimelineTrack }> {
        const response = await api.put(`/timeline/tracks/${id}`, data);
        return response.data;
    },

    async deleteTrack(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/timeline/tracks/${id}`);
        return response.data;
    },

    // Events
    async getEventsByTrack(trackId: string): Promise<{ success: boolean; data: { events: TimelineEvent[]; total: number } }> {
        const response = await api.get(`/timeline/tracks/${trackId}/events`);
        return response.data;
    },

    async createEvent(data: CreateEventData): Promise<{ success: boolean; data: TimelineEvent }> {
        const response = await api.post('/timeline/events', data);
        return response.data;
    },

    async updateEvent(id: string, data: Partial<CreateEventData>): Promise<{ success: boolean; data: TimelineEvent }> {
        const response = await api.put(`/timeline/events/${id}`, data);
        return response.data;
    },

    async deleteEvent(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/timeline/events/${id}`);
        return response.data;
    }
};

export const defaultTrackColors = [
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Deep Orange
    '#6366F1', // Indigo
    '#84CC16'  // Lime
];

export const getRandomColor = () => {
    return defaultTrackColors[Math.floor(Math.random() * defaultTrackColors.length)];
};
