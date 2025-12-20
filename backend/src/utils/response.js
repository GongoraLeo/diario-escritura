/**
 * Respuesta exitosa estándar
 */
export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Respuesta de error estándar
 */
export const errorResponse = (res, message = 'Error en la operación', statusCode = 400, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors })
    });
};

/**
 * Respuesta de error de validación
 */
export const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
        success: false,
        message: 'Error de validación',
        errors
    });
};

/**
 * Respuesta de no autorizado
 */
export const unauthorizedResponse = (res, message = 'No autorizado') => {
    return res.status(401).json({
        success: false,
        message
    });
};

/**
 * Respuesta de prohibido
 */
export const forbiddenResponse = (res, message = 'Acceso prohibido') => {
    return res.status(403).json({
        success: false,
        message
    });
};

/**
 * Respuesta de no encontrado
 */
export const notFoundResponse = (res, message = 'Recurso no encontrado') => {
    return res.status(404).json({
        success: false,
        message
    });
};
