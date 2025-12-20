import db from '../config/database.js';

export const User = {
    /**
     * Crear un nuevo usuario
     */
    async create(userData) {
        const { username, email, password_hash, role = 'user', full_name } = userData;

        const [result] = await db.execute(
            `INSERT INTO users (username, email, password_hash, role, full_name) 
       VALUES (?, ?, ?, ?, ?)`,
            [username, email, password_hash, role, full_name]
        );

        return result.insertId;
    },

    /**
     * Buscar usuario por email
     */
    async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    /**
     * Buscar usuario por username
     */
    async findByUsername(username) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    /**
     * Buscar usuario por ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, email, role, avatar_url, full_name, bio, is_active, email_verified, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    /**
     * Actualizar último login
     */
    async updateLastLogin(id) {
        await db.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [id]
        );
    },

    /**
     * Obtener todos los usuarios (para admin)
     */
    async findAll() {
        const [rows] = await db.execute(
            'SELECT id, username, email, role, full_name, is_active, email_verified, last_login, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    },

    /**
     * Actualizar estado activo del usuario
     */
    async updateActiveStatus(id, is_active) {
        await db.execute(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [is_active, id]
        );
    },

    /**
     * Actualizar perfil de usuario
     */
    async updateProfile(id, profileData) {
        const { full_name, bio, avatar_url } = profileData;
        await db.execute(
            'UPDATE users SET full_name = ?, bio = ?, avatar_url = ? WHERE id = ?',
            [full_name, bio, avatar_url, id]
        );
    }
};
