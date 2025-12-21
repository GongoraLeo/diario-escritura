import db from '../config/database.js';

export const Plot = {
    /**
     * Crear una nueva trama
     */
    async create(plotData) {
        const { novel_id, structure_type, plot_points } = plotData;

        const [result] = await db.execute(
            `INSERT INTO plots (novel_id, structure_type, plot_points) 
       VALUES (?, ?, ?)`,
            [novel_id, structure_type, JSON.stringify(plot_points || {})]
        );

        return result.insertId;
    },

    /**
     * Obtener trama por novela
     */
    async findByNovelId(novel_id) {
        const [rows] = await db.execute(
            'SELECT * FROM plots WHERE novel_id = ?',
            [novel_id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            plot_points: JSON.parse(row.plot_points || '{}')
        };
    },

    /**
     * Obtener trama por ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM plots WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            ...row,
            plot_points: JSON.parse(row.plot_points || '{}')
        };
    },

    /**
     * Actualizar trama
     */
    async update(id, plotData) {
        const { structure_type, plot_points } = plotData;

        await db.execute(
            `UPDATE plots SET structure_type = ?, plot_points = ? WHERE id = ?`,
            [structure_type, JSON.stringify(plot_points || {}), id]
        );
    },

    /**
     * Eliminar trama
     */
    async delete(id) {
        await db.execute('DELETE FROM plots WHERE id = ?', [id]);
    }
};
