import db from '../config/database.js';

export const Note = {
    async create(noteData) {
        const { novel_id, type, title, content } = noteData;
        const [result] = await db.execute(
            'INSERT INTO notes (novel_id, type, title, content) VALUES (?, ?, ?, ?)',
            [novel_id, type, title, content]
        );
        return result.insertId;
    },

    async findByNovelId(novel_id, type = null) {
        let query = 'SELECT * FROM notes WHERE novel_id = ?';
        const params = [novel_id];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY updated_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    },

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM notes WHERE id = ?', [id]);
        return rows[0];
    },

    async update(id, noteData) {
        const { title, content } = noteData;
        await db.execute(
            'UPDATE notes SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );
    },

    async delete(id) {
        await db.execute('DELETE FROM notes WHERE id = ?', [id]);
    }
};
