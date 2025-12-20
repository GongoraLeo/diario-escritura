import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Genera un token JWT
 */
export const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Genera un refresh token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};

/**
 * Verifica un token JWT
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

/**
 * Verifica un refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Refresh token inválido o expirado');
    }
};
