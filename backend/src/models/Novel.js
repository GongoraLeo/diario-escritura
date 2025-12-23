import db from '../config/database.js';

export const Novel = {
    /**
     * Crear una nueva novela
     */
    async create(novelData) {
        const { user_id, title, description, cover_image } = novelData;

        // Generar UUID
        const [[{ uuid }]] = await db.execute('SELECT UUID() as uuid');

        await db.execute(
            `INSERT INTO novels (id, user_id, title, description, cover_image) 
       VALUES (?, ?, ?, ?, ?)`,
            [uuid, user_id, title, description || null, cover_image || null]
        );

        return uuid;
    },

    /**
     * Obtener todas las novelas de un usuario
     */
    async findByUserId(user_id) {
        const [rows] = await db.execute(
            'SELECT * FROM novels WHERE user_id = ? ORDER BY updated_at DESC',
            [user_id]
        );
        return rows;
    },

    /**
     * Obtener una novela por ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM novels WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    /**
     * Verificar si una novela pertenece a un usuario
     */
    async belongsToUser(novelId, userId) {
        const [rows] = await db.execute(
            'SELECT id FROM novels WHERE id = ? AND user_id = ?',
            [novelId, userId]
        );
        return rows.length > 0;
    },

    /**
     * Actualizar una novela
     */
    async update(id, novelData) {
        const { title, description, cover_image } = novelData;
        await db.execute(
            'UPDATE novels SET title = ?, description = ?, cover_image = ? WHERE id = ?',
            [title, description, cover_image, id]
        );
    },

    /**
     * Actualizar contador de palabras
     */
    async updateWordCount(id, word_count) {
        await db.execute(
            'UPDATE novels SET word_count = ? WHERE id = ?',
            [word_count, id]
        );
    },

    /**
     * Eliminar una novela
     */
    async delete(id) {
        await db.execute('DELETE FROM novels WHERE id = ?', [id]);
    },

    /**
     * Obtener estadísticas de una novela
     */
    async getStats(novelId) {
        // Contar personajes
        const [charactersResult] = await db.execute(
            'SELECT COUNT(*) as count FROM characters WHERE novel_id = ?',
            [novelId]
        );

        // Contar escenas
        const [scenesResult] = await db.execute(
            'SELECT COUNT(*) as count FROM scenes WHERE novel_id = ?',
            [novelId]
        );

        // Contar apuntes
        const [notesResult] = await db.execute(
            'SELECT COUNT(*) as count FROM notes WHERE novel_id = ?',
            [novelId]
        );

        // Obtener palabra count
        const novel = await this.findById(novelId);

        return {
            word_count: novel?.word_count || 0,
            characters_count: charactersResult[0].count,
            scenes_count: scenesResult[0].count,
            notes_count: notesResult[0].count
        };
    }
};
