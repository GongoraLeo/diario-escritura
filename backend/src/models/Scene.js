import crypto from 'node:crypto';
import db from '../config/database.js';

export const Scene = {
    async create(sceneData) {
        const {
            novel_id, scene_number, title, location,
            time_of_day, characters, description, pov,
            objective, style, themes, emotional_tone,
            pacing, dramatic_beats, status, language_features
        } = sceneData;

        const id = crypto.randomUUID();

        await db.execute(
            `INSERT INTO scenes (
        id, novel_id, scene_number, title, location, 
        time_of_day, characters, description, pov,
        objective, style, themes, emotional_tone,
        pacing, dramatic_beats, status, language_features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, novel_id, scene_number, title, location,
                time_of_day, JSON.stringify(characters || []), description, pov,
                objective, style, JSON.stringify(themes || []), emotional_tone,
                pacing, JSON.stringify(dramatic_beats || []), status || 'draft',
                JSON.stringify(language_features || [])
            ]
        );
        return id;
    },

    async findByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM scenes WHERE novel_id = ? ORDER BY scene_number ASC',
            [novel_id]
        );

        return rows.map(row => ({
            ...row,
            characters: JSON.parse(row.characters || '[]'),
            language_features: JSON.parse(row.language_features || '[]'),
            themes: JSON.parse(row.themes || '[]'),
            dramatic_beats: JSON.parse(row.dramatic_beats || '[]')
        }));
    },

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM scenes WHERE id = ?', [id]);
        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            characters: JSON.parse(row.characters || '[]'),
            language_features: JSON.parse(row.language_features || '[]'),
            themes: JSON.parse(row.themes || '[]'),
            dramatic_beats: JSON.parse(row.dramatic_beats || '[]')
        };
    },

    async update(id, sceneData) {
        const fields = [];
        const values = [];

        // Mapeo de campos que deben ser stringificados
        const jsonFields = ['characters', 'language_features', 'themes', 'dramatic_beats'];

        for (const [key, value] of Object.entries(sceneData)) {
            if (value === undefined) continue;

            fields.push(`${key} = ?`);
            if (jsonFields.includes(key)) {
                // Asegurar que sea array si es null/undefined
                values.push(JSON.stringify(value || []));
            } else {
                values.push(value);
            }
        }

        if (fields.length === 0) return;

        values.push(id);
        const query = `UPDATE scenes SET ${fields.join(', ')} WHERE id = ?`;
        await db.execute(query, values);
    },

    async delete(id) {
        await db.execute('DELETE FROM scenes WHERE id = ?', [id]);
    }
};
