import db from '../config/database.js';

export const Character = {
    /**
     * Crear un nuevo personaje
     */
    async create(characterData) {
        const {
            novel_id,
            name,
            avatar,
            personal_data,
            physical_appearance,
            psychology,
            goals,
            past,
            present,
            future,
            speech_patterns,
            relationships,
            additional_info
        } = characterData;

        // Generar UUID
        const [[{ uuid }]] = await db.execute('SELECT UUID() as uuid');

        await db.execute(
            `INSERT INTO characters (
        id, novel_id, name, avatar, personal_data, physical_appearance,
        psychology, goals, past, present, future, speech_patterns,
        relationships, additional_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                uuid,
                novel_id,
                name,
                avatar || null,
                JSON.stringify(personal_data || {}),
                JSON.stringify(physical_appearance || {}),
                JSON.stringify(psychology || {}),
                JSON.stringify(goals || {}),
                JSON.stringify(past || {}),
                JSON.stringify(present || {}),
                JSON.stringify(future || {}),
                JSON.stringify(speech_patterns || {}),
                JSON.stringify(relationships || {}),
                JSON.stringify(additional_info || {})
            ]
        );

        return uuid;
    },

    /**
     * Obtener todos los personajes de una novela
     */
    async findByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM characters WHERE novel_id = ? ORDER BY created_at DESC',
            [novel_id]
        );

        // Parsear JSON
        return rows.map(row => ({
            ...row,
            personal_data: JSON.parse(row.personal_data || '{}'),
            physical_appearance: JSON.parse(row.physical_appearance || '{}'),
            psychology: JSON.parse(row.psychology || '{}'),
            goals: JSON.parse(row.goals || '{}'),
            past: JSON.parse(row.past || '{}'),
            present: JSON.parse(row.present || '{}'),
            future: JSON.parse(row.future || '{}'),
            speech_patterns: JSON.parse(row.speech_patterns || '{}'),
            relationships: JSON.parse(row.relationships || '{}'),
            additional_info: JSON.parse(row.additional_info || '{}')
        }));
    },

    /**
     * Obtener un personaje por ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM characters WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            personal_data: JSON.parse(row.personal_data || '{}'),
            physical_appearance: JSON.parse(row.physical_appearance || '{}'),
            psychology: JSON.parse(row.psychology || '{}'),
            goals: JSON.parse(row.goals || '{}'),
            past: JSON.parse(row.past || '{}'),
            present: JSON.parse(row.present || '{}'),
            future: JSON.parse(row.future || '{}'),
            speech_patterns: JSON.parse(row.speech_patterns || '{}'),
            relationships: JSON.parse(row.relationships || '{}'),
            additional_info: JSON.parse(row.additional_info || '{}')
        };
    },

    /**
     * Actualizar un personaje
     */
    async update(id, characterData) {
        const {
            name,
            avatar,
            personal_data,
            physical_appearance,
            psychology,
            goals,
            past,
            present,
            future,
            speech_patterns,
            relationships,
            additional_info
        } = characterData;

        await db.execute(
            `UPDATE characters SET
        name = ?, avatar = ?, personal_data = ?, physical_appearance = ?,
        psychology = ?, goals = ?, past = ?, present = ?, future = ?,
        speech_patterns = ?, relationships = ?, additional_info = ?
      WHERE id = ?`,
            [
                name,
                avatar,
                JSON.stringify(personal_data || {}),
                JSON.stringify(physical_appearance || {}),
                JSON.stringify(psychology || {}),
                JSON.stringify(goals || {}),
                JSON.stringify(past || {}),
                JSON.stringify(present || {}),
                JSON.stringify(future || {}),
                JSON.stringify(speech_patterns || {}),
                JSON.stringify(relationships || {}),
                JSON.stringify(additional_info || {}),
                id
            ]
        );
    },

    /**
     * Eliminar un personaje
     */
    async delete(id) {
        await db.execute('DELETE FROM characters WHERE id = ?', [id]);
    }
};
