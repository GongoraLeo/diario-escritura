import db from '../config/database.js';

export const Scene = {
    async create(sceneData) {
        const {
            novel_id, scene_number, location, time_of_day, characters,
            pov, objective, description, language_features, themes,
            dramatic_beats, plot_connection, emotional_state, notes, status
        } = sceneData;

        const [result] = await db.execute(
            `INSERT INTO scenes (
        novel_id, scene_number, location, time_of_day, characters, pov,
        objective, description, language_features, themes, dramatic_beats,
        plot_connection, emotional_state, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                novel_id, scene_number, location, time_of_day,
                JSON.stringify(characters || []),
                pov, objective, description,
                JSON.stringify(language_features || {}),
                JSON.stringify(themes || []),
                JSON.stringify(dramatic_beats || []),
                plot_connection, emotional_state, notes, status || 'draft'
            ]
        );

        return result.insertId;
    },

    async findByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM scenes WHERE novel_id = ? ORDER BY scene_number ASC',
            [novel_id]
        );

        return rows.map(row => ({
            ...row,
            characters: JSON.parse(row.characters || '[]'),
            language_features: JSON.parse(row.language_features || '{}'),
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
            language_features: JSON.parse(row.language_features || '{}'),
            themes: JSON.parse(row.themes || '[]'),
            dramatic_beats: JSON.parse(row.dramatic_beats || '[]')
        };
    },

    async update(id, sceneData) {
        const {
            scene_number, location, time_of_day, characters, pov, objective,
            description, language_features, themes, dramatic_beats,
            plot_connection, emotional_state, notes, status
        } = sceneData;

        await db.execute(
            `UPDATE scenes SET
        scene_number = ?, location = ?, time_of_day = ?, characters = ?,
        pov = ?, objective = ?, description = ?, language_features = ?,
        themes = ?, dramatic_beats = ?, plot_connection = ?,
        emotional_state = ?, notes = ?, status = ?
      WHERE id = ?`,
            [
                scene_number, location, time_of_day, JSON.stringify(characters || []),
                pov, objective, description, JSON.stringify(language_features || {}),
                JSON.stringify(themes || []), JSON.stringify(dramatic_beats || []),
                plot_connection, emotional_state, notes, status, id
            ]
        );
    },

    async delete(id) {
        await db.execute('DELETE FROM scenes WHERE id = ?', [id]);
    }
};
