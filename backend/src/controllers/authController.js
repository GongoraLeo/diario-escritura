import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse
} from '../utils/response.js';

// Esquemas de validación
const registerSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(50),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    full_name: z.string().min(2, 'El nombre completo debe tener al menos 2 caracteres').optional()
});

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

/**
 * Registro de nuevo usuario
 */
export const register = async (req, res) => {
    try {
        // Validar datos
        const validatedData = registerSchema.parse(req.body);

        // Verificar si el email ya existe
        const existingEmail = await User.findByEmail(validatedData.email);
        if (existingEmail) {
            return errorResponse(res, 'El email ya está registrado', 400);
        }

        // Verificar si el username ya existe
        const existingUsername = await User.findByUsername(validatedData.username);
        if (existingUsername) {
            return errorResponse(res, 'El nombre de usuario ya está en uso', 400);
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(validatedData.password, salt);

        // Crear usuario
        const userId = await User.create({
            username: validatedData.username,
            email: validatedData.email,
            password_hash,
            full_name: validatedData.full_name || validatedData.username
        });

        // Obtener usuario creado
        const user = await User.findById(userId);

        // Generar tokens
        const token = generateToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id });

        return successResponse(
            res,
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                },
                token,
                refreshToken
            },
            'Usuario registrado exitosamente',
            201
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error en registro:', error);
        return errorResponse(res, 'Error al registrar usuario', 500);
    }
};

/**
 * Login de usuario
 */
export const login = async (req, res) => {
    try {
        // Validar datos
        const validatedData = loginSchema.parse(req.body);

        // Buscar usuario por email
        const user = await User.findByEmail(validatedData.email);
        if (!user) {
            return errorResponse(res, 'Credenciales inválidas', 401);
        }

        // Verificar si el usuario está activo
        if (!user.is_active) {
            return errorResponse(res, 'Usuario desactivado. Contacta al administrador', 403);
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password_hash);
        if (!isValidPassword) {
            return errorResponse(res, 'Credenciales inválidas', 401);
        }

        // Actualizar último login
        await User.updateLastLogin(user.id);

        // Generar tokens
        const token = generateToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id });

        return successResponse(res, {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url
            },
            token,
            refreshToken
        }, 'Login exitoso');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error en login:', error);
        return errorResponse(res, 'Error al iniciar sesión', 500);
    }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'Usuario no encontrado', 404);
        }

        return successResponse(res, {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            bio: user.bio,
            avatar_url: user.avatar_url,
            role: user.role,
            email_verified: user.email_verified,
            created_at: user.created_at
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return errorResponse(res, 'Error al obtener perfil', 500);
    }
};

/**
 * Actualizar perfil del usuario
 */
export const updateProfile = async (req, res) => {
    try {
        const { full_name, bio, avatar_url } = req.body;

        await User.updateProfile(req.user.id, { full_name, bio, avatar_url });

        const updatedUser = await User.findById(req.user.id);

        return successResponse(res, {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            bio: updatedUser.bio,
            avatar_url: updatedUser.avatar_url
        }, 'Perfil actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return errorResponse(res, 'Error al actualizar perfil', 500);
    }
};
