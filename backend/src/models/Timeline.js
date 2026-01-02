import crypto from 'node:crypto';
import db from '../config/database.js';

export const Timeline = {
    async createTrack(trackData) {
        const { novel_id, name, color, order, max_units } = trackData;
        const id = crypto.randomUUID();
        await db.execute(
            'INSERT INTO timelines (id, novel_id, name, color, `order`, max_units) VALUES (?, ?, ?, ?, ?, ?)',
            [id, novel_id, name, color || '#8B5CF6', order || 0, max_units || 100]
        );
        return id;
    },

    async findTracksByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM timelines WHERE novel_id = ? ORDER BY `order` ASC',
            [novel_id]
        );
        return rows;
    },

    async updateTrack(id, trackData) {
        const { name, color, order, max_units } = trackData;

        let query = 'UPDATE timelines SET ';
        const params = [];
        const updates = [];

        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        if (color !== undefined) {
            updates.push('color = ?');
            params.push(color);
        }
        if (order !== undefined) {
            updates.push('`order` = ?');
            params.push(order);
        }
        if (max_units !== undefined) {
            updates.push('max_units = ?');
            params.push(max_units);
        }

        if (updates.length === 0) return;

        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
    },

    async deleteTrack(id) {
        await db.execute('DELETE FROM timelines WHERE id = ?', [id]);
    },

    async createEvent(eventData) {
        const {
            track_id, title, description,
            color, start_position, duration
        } = eventData;
        const id = crypto.randomUUID();

        await db.execute(
            `INSERT INTO timeline_events(
    id, track_id, title, description,
    color, start_position, duration
) VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                id, track_id, title, description || '',
                color || '#8B5CF6', start_position || 0, duration || 10
            ]
        );
        return id;
    },

    async findEventsByTrackId(track_id) {
        const [rows] = await db.execute(
            'SELECT * FROM timeline_events WHERE track_id = ? ORDER BY start_position ASC',
            [track_id]
        );
        return rows;
    },

    async findEventById(id) {
        const [rows] = await db.execute('SELECT * FROM timeline_events WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return rows[0];
    },

    async updateEvent(id, eventData) {
        const {
            track_id, title, description,
            color, start_position, duration
        } = eventData;

        let query = 'UPDATE timeline_events SET ';
        const params = [];
        const updates = [];

        if (track_id !== undefined) {
            updates.push('track_id = ?');
            params.push(track_id);
        }
        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (color !== undefined) {
            updates.push('color = ?');
            params.push(color);
        }
        if (start_position !== undefined) {
            updates.push('start_position = ?');
            params.push(start_position);
        }
        if (duration !== undefined) {
            updates.push('duration = ?');
            params.push(duration);
        }

        if (updates.length === 0) return;

        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
    },

    async deleteEvent(id) {
        await db.execute('DELETE FROM timeline_events WHERE id = ?', [id]);
    }
};
