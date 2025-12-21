import db from '../config/database.js';

export const Timeline = {
    async createTrack(trackData) {
        const { novel_id, track_name, track_order } = trackData;
        const [result] = await db.execute(
            'INSERT INTO timelines (novel_id, track_name, track_order) VALUES (?, ?, ?)',
            [novel_id, track_name, track_order || 0]
        );
        return result.insertId;
    },

    async findTracksByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM timelines WHERE novel_id = ? ORDER BY track_order ASC',
            [novel_id]
        );
        return rows;
    },

    async updateTrack(id, trackData) {
        const { track_name, track_order } = trackData;
        await db.execute(
            'UPDATE timelines SET track_name = ?, track_order = ? WHERE id = ?',
            [track_name, track_order, id]
        );
    },

    async deleteTrack(id) {
        await db.execute('DELETE FROM timelines WHERE id = ?', [id]);
    },

    async createEvent(eventData) {
        const {
            timeline_id, title, date_chapter, characters, description,
            importance, color, position_x
        } = eventData;

        const [result] = await db.execute(
            `INSERT INTO timeline_events (
        timeline_id, title, date_chapter, characters, description,
        importance, color, position_x
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                timeline_id, title, date_chapter, JSON.stringify(characters || []),
                description, importance || 3, color || '#FFF59D', position_x || 0
            ]
        );
        return result.insertId;
    },

    async findEventsByTrackId(timeline_id) {
        const [rows] = await db.execute(
            'SELECT * FROM timeline_events WHERE timeline_id = ? ORDER BY position_x ASC',
            [timeline_id]
        );
        return rows.map(row => ({
            ...row,
            characters: JSON.parse(row.characters || '[]')
        }));
    },

    async findEventById(id) {
        const [rows] = await db.execute('SELECT * FROM timeline_events WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            characters: JSON.parse(row.characters || '[]')
        };
    },

    async updateEvent(id, eventData) {
        const {
            title, date_chapter, characters, description,
            importance, color, position_x
        } = eventData;

        await db.execute(
            `UPDATE timeline_events SET
        title = ?, date_chapter = ?, characters = ?, description = ?,
        importance = ?, color = ?, position_x = ?
      WHERE id = ?`,
            [
                title, date_chapter, JSON.stringify(characters || []),
                description, importance, color, position_x, id
            ]
        );
    },

    async deleteEvent(id) {
        await db.execute('DELETE FROM timeline_events WHERE id = ?', [id]);
    }
};
