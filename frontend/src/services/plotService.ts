import { api } from './api';

export interface Plot {
    id: string;
    novel_id: string;
    structure_type: '3_acts' | '5_acts' | 'hero_journey' | 'save_cat' | 'story_circle' | 'free';
    plot_points: any;
    created_at: string;
    updated_at: string;
}

export interface CreatePlotData {
    novel_id: string;
    structure_type: '3_acts' | '5_acts' | 'hero_journey' | 'save_cat' | 'story_circle' | 'free';
    plot_points: any;
}

export const plotService = {
    async getByNovel(novelId: string): Promise<{ success: boolean; data: Plot | null }> {
        const response = await api.get(`/plots/novel/${novelId}`);
        return response.data;
    },

    async createOrUpdate(data: CreatePlotData): Promise<{ success: boolean; data: Plot }> {
        const response = await api.post('/plots', data);
        return response.data;
    },

    async delete(id: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/plots/${id}`);
        return response.data;
    }
};

// Definiciones de estructuras
export const plotStructures = {
    '3_acts': {
        name: 'Estructura de 3 Actos',
        icon: '📖',
        description: 'Estructura clásica: Planteamiento, Confrontación, Resolución',
        fields: [
            { key: 'act1_setup', label: 'Acto I - Planteamiento', placeholder: 'Presentación del mundo, personajes y conflicto inicial...' },
            { key: 'act1_inciting', label: 'Incidente Incitador', placeholder: 'Evento que desencadena la historia...' },
            { key: 'act1_first_plot', label: 'Primer Punto de Giro', placeholder: 'El protagonista se compromete con la aventura...' },
            { key: 'act2_rising', label: 'Acto II - Confrontación', placeholder: 'Desarrollo del conflicto, obstáculos crecientes...' },
            { key: 'act2_midpoint', label: 'Punto Medio', placeholder: 'Giro importante que cambia la dirección...' },
            { key: 'act2_second_plot', label: 'Segundo Punto de Giro', placeholder: 'Todo parece perdido, momento más oscuro...' },
            { key: 'act3_climax', label: 'Acto III - Clímax', placeholder: 'Confrontación final...' },
            { key: 'act3_resolution', label: 'Resolución', placeholder: 'Consecuencias y nuevo equilibrio...' }
        ]
    },
    '5_acts': {
        name: 'Estructura de 5 Actos (Freytag)',
        icon: '🎭',
        description: 'Pirámide de Freytag: Exposición, Acción Ascendente, Clímax, Acción Descendente, Desenlace',
        fields: [
            { key: 'exposition', label: '1. Exposición', placeholder: 'Presentación del mundo y personajes...' },
            { key: 'rising_action', label: '2. Acción Ascendente', placeholder: 'Complicaciones y tensión creciente...' },
            { key: 'climax', label: '3. Clímax', placeholder: 'Punto de máxima tensión...' },
            { key: 'falling_action', label: '4. Acción Descendente', placeholder: 'Consecuencias del clímax...' },
            { key: 'denouement', label: '5. Desenlace', placeholder: 'Resolución final...' }
        ]
    },
    'hero_journey': {
        name: 'Viaje del Héroe',
        icon: '🗺️',
        description: '12 etapas de Campbell/Vogler',
        fields: [
            { key: 'ordinary_world', label: '1. Mundo Ordinario', placeholder: 'Vida normal del héroe...' },
            { key: 'call_adventure', label: '2. Llamada a la Aventura', placeholder: 'Se presenta el desafío...' },
            { key: 'refusal_call', label: '3. Rechazo de la Llamada', placeholder: 'Dudas y miedos iniciales...' },
            { key: 'meeting_mentor', label: '4. Encuentro con el Mentor', placeholder: 'Guía que prepara al héroe...' },
            { key: 'crossing_threshold', label: '5. Cruce del Umbral', placeholder: 'Entrada al mundo especial...' },
            { key: 'tests_allies', label: '6. Pruebas, Aliados y Enemigos', placeholder: 'Aprendizaje y formación de equipo...' },
            { key: 'approach_cave', label: '7. Aproximación a la Caverna', placeholder: 'Preparación para el desafío mayor...' },
            { key: 'ordeal', label: '8. Ordalía', placeholder: 'Confrontación con el mayor miedo...' },
            { key: 'reward', label: '9. Recompensa', placeholder: 'Obtención del tesoro o conocimiento...' },
            { key: 'road_back', label: '10. Camino de Regreso', placeholder: 'Decisión de volver al mundo ordinario...' },
            { key: 'resurrection', label: '11. Resurrección', placeholder: 'Prueba final y transformación...' },
            { key: 'return_elixir', label: '12. Regreso con el Elixir', placeholder: 'Vuelta transformado con el don...' }
        ]
    },
    'save_cat': {
        name: 'Save the Cat',
        icon: '🐱',
        description: '15 beats de Blake Snyder',
        fields: [
            { key: 'opening_image', label: '1. Imagen de Apertura', placeholder: 'Snapshot del mundo antes...' },
            { key: 'theme_stated', label: '2. Tema Establecido', placeholder: 'Lección que aprenderá el protagonista...' },
            { key: 'setup', label: '3. Planteamiento', placeholder: 'Presentación del mundo y personajes...' },
            { key: 'catalyst', label: '4. Catalizador', placeholder: 'Evento que cambia todo...' },
            { key: 'debate', label: '5. Debate', placeholder: '¿Debería actuar o no?...' },
            { key: 'break_two', label: '6. Ruptura al Acto 2', placeholder: 'Decisión de actuar...' },
            { key: 'b_story', label: '7. Historia B', placeholder: 'Subtrama, usualmente romántica...' },
            { key: 'fun_games', label: '8. Diversión y Juegos', placeholder: 'Promesa del premise...' },
            { key: 'midpoint', label: '9. Punto Medio', placeholder: 'Falsa victoria o falsa derrota...' },
            { key: 'bad_guys_close', label: '10. Los Malos se Acercan', placeholder: 'Complicaciones crecientes...' },
            { key: 'all_lost', label: '11. Todo está Perdido', placeholder: 'Momento más oscuro...' },
            { key: 'dark_night', label: '12. Noche Oscura del Alma', placeholder: 'Reflexión y desesperación...' },
            { key: 'break_three', label: '13. Ruptura al Acto 3', placeholder: 'Descubrimiento de la solución...' },
            { key: 'finale', label: '14. Final', placeholder: 'Confrontación y resolución...' },
            { key: 'final_image', label: '15. Imagen Final', placeholder: 'Snapshot del mundo después...' }
        ]
    },
    'story_circle': {
        name: 'Círculo de Historia',
        icon: '⭕',
        description: '8 pasos de Dan Harmon',
        fields: [
            { key: 'you', label: '1. Tú (Zona de Confort)', placeholder: 'Personaje en su mundo normal...' },
            { key: 'need', label: '2. Necesidad', placeholder: 'Algo falta o está mal...' },
            { key: 'go', label: '3. Ir', placeholder: 'Entra en situación desconocida...' },
            { key: 'search', label: '4. Buscar', placeholder: 'Se adapta y busca lo que necesita...' },
            { key: 'find', label: '5. Encontrar', placeholder: 'Consigue lo que quería...' },
            { key: 'take', label: '6. Tomar', placeholder: 'Paga un precio por ello...' },
            { key: 'return', label: '7. Regresar', placeholder: 'Vuelve a su mundo familiar...' },
            { key: 'change', label: '8. Cambiar', placeholder: 'Transformado por la experiencia...' }
        ]
    },
    'free': {
        name: 'Trama Libre',
        icon: '✏️',
        description: 'Crea tu propia estructura personalizada',
        fields: [
            { key: 'custom_structure', label: 'Estructura Personalizada', placeholder: 'Define tus propios puntos de trama como prefieras...', multiline: true as const, rows: 10 }
        ]
    }
};
