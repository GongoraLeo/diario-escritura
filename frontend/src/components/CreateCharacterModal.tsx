import { useState } from 'react';
import { characterService, type CreateCharacterData } from '../services/characterService';

interface CreateCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    novelId: string;
}

export default function CreateCharacterModal({ isOpen, onClose, onSuccess, novelId }: CreateCharacterModalProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<CreateCharacterData>({
        novel_id: novelId,
        name: '',
        avatar: '',
        personal_data: {},
        physical_appearance: {},
        psychology: {},
        goals: {},
        past: {},
        present: {},
        future: {},
        speech_patterns: {},
        relationships: {},
        additional_info: {}
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const tabs = [
        { id: 0, label: '1. Identidad', icon: '🆔' },
        { id: 1, label: '2. Apariencia', icon: '👤' },
        { id: 2, label: '3. Psicología', icon: '🧠' },
        { id: 3, label: '4. Metas', icon: '🎯' },
        { id: 4, label: '5. Pasado', icon: '📜' },
        { id: 5, label: '6. Presente', icon: '📍' },
        { id: 7, label: '7. Futuro', icon: '🔮' },
        { id: 8, label: '8. Forma de Hablar', icon: '💬' },
        { id: 9, label: '9. Relaciones', icon: '👥' },
        { id: 10, label: '10. Info Adicional', icon: '📝' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('El nombre del personaje es obligatorio');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await characterService.create(formData);
            setFormData({
                novel_id: novelId,
                name: '',
                avatar: '',
                personal_data: {},
                physical_appearance: {},
                psychology: {},
                goals: {},
                past: {},
                present: {},
                future: {},
                speech_patterns: {},
                relationships: {},
                additional_info: {}
            });
            setActiveTab(0);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear el personaje');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Nuevo Personaje</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {/* Tab 0: Identidad */}
                    {activeTab === 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de Identidad</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Personaje *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Aragorn"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL del Avatar (opcional)
                                </label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        value={formData.personal_data?.age || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            personal_data: { ...formData.personal_data, age: e.target.value }
                                        })}
                                        placeholder="87 años"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        value={formData.personal_data?.occupation || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            personal_data: { ...formData.personal_data, occupation: e.target.value }
                                        })}
                                        placeholder="Guardabosques"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    value={formData.personal_data?.origin || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        personal_data: { ...formData.personal_data, origin: e.target.value }
                                    })}
                                    placeholder="Rivendel"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 1: Apariencia */}
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción Física</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        value={formData.physical_appearance?.height || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            physical_appearance: { ...formData.physical_appearance, height: e.target.value }
                                        })}
                                        placeholder="1.98m"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Complexión</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        value={formData.physical_appearance?.build || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            physical_appearance: { ...formData.physical_appearance, build: e.target.value }
                                        })}
                                        placeholder="Atlética"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cabello</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    value={formData.physical_appearance?.hair || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        physical_appearance: { ...formData.physical_appearance, hair: e.target.value }
                                    })}
                                    placeholder="Negro, largo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ojos</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    value={formData.physical_appearance?.eyes || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        physical_appearance: { ...formData.physical_appearance, eyes: e.target.value }
                                    })}
                                    placeholder="Grises"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rasgos Distintivos</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.physical_appearance?.distinctive_features || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        physical_appearance: { ...formData.physical_appearance, distinctive_features: e.target.value }
                                    })}
                                    placeholder="Cicatriz en la mejilla, porte noble..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Psicología */}
                    {activeTab === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil Psicológico</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rasgos de Personalidad</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.psychology?.traits || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        psychology: { ...formData.psychology, traits: e.target.value }
                                    })}
                                    placeholder="Valiente, leal, noble, reservado..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Miedos</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.psychology?.fears || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        psychology: { ...formData.psychology, fears: e.target.value }
                                    })}
                                    placeholder="Fallar a su pueblo, repetir los errores del pasado..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivaciones</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.psychology?.motivations || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        psychology: { ...formData.psychology, motivations: e.target.value }
                                    })}
                                    placeholder="Proteger a los inocentes, restaurar el reino..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Metas */}
                    {activeTab === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas y Objetivos</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Principal</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.goals?.main_goal || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        goals: { ...formData.goals, main_goal: e.target.value }
                                    })}
                                    placeholder="Reclamar el trono de Gondor..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos Secundarios</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.goals?.secondary_goals || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        goals: { ...formData.goals, secondary_goals: e.target.value }
                                    })}
                                    placeholder="Proteger a los hobbits, unir a los pueblos libres..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conflictos Internos</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.goals?.internal_conflicts || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        goals: { ...formData.goals, internal_conflicts: e.target.value }
                                    })}
                                    placeholder="Duda sobre su derecho al trono, miedo a la debilidad humana..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Pasado */}
                    {activeTab === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia de Fondo</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Infancia</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.past?.childhood || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        past: { ...formData.past, childhood: e.target.value }
                                    })}
                                    placeholder="Criado en Rivendel por Elrond..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eventos Importantes</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.past?.key_events || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        past: { ...formData.past, key_events: e.target.value }
                                    })}
                                    placeholder="Descubrió su verdadera identidad, conoció a Arwen..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 5: Presente */}
                    {activeTab === 5 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Situación Actual</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Situación Presente en la Historia</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.present?.current_situation || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        present: { ...formData.present, current_situation: e.target.value }
                                    })}
                                    placeholder="Guardabosques del Norte, protegiendo la Comarca..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Desafíos Actuales</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.present?.current_challenges || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        present: { ...formData.present, current_challenges: e.target.value }
                                    })}
                                    placeholder="Debe guiar a Frodo, enfrentar su destino..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 7: Futuro */}
                    {activeTab === 7 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arco de Transformación</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Evolución del Personaje</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.future?.character_arc || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        future: { ...formData.future, character_arc: e.target.value }
                                    })}
                                    placeholder="De guardabosques errante a rey de Gondor..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destino Final</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.future?.final_fate || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        future: { ...formData.future, final_fate: e.target.value }
                                    })}
                                    placeholder="Se convierte en rey, se casa con Arwen..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 8: Forma de Hablar */}
                    {activeTab === 8 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patrones de Lenguaje</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vocabulario Característico</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.speech_patterns?.vocabulary || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        speech_patterns: { ...formData.speech_patterns, vocabulary: e.target.value }
                                    })}
                                    placeholder="Formal, arcaico, usa términos élficos..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tono y Estilo</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.speech_patterns?.tone || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        speech_patterns: { ...formData.speech_patterns, tone: e.target.value }
                                    })}
                                    placeholder="Grave, mesurado, inspirador..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Frases Características</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.speech_patterns?.catchphrases || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        speech_patterns: { ...formData.speech_patterns, catchphrases: e.target.value }
                                    })}
                                    placeholder='"No todos los que vagan están perdidos"'
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 9: Relaciones */}
                    {activeTab === 9 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Relaciones con Otros Personajes</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aliados y Amigos</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.relationships?.allies || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        relationships: { ...formData.relationships, allies: e.target.value }
                                    })}
                                    placeholder="Gandalf (mentor), Legolas (amigo), Gimli (compañero)..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enemigos y Rivales</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.relationships?.enemies || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        relationships: { ...formData.relationships, enemies: e.target.value }
                                    })}
                                    placeholder="Sauron, Saruman..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relaciones Románticas</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.relationships?.romantic || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        relationships: { ...formData.relationships, romantic: e.target.value }
                                    })}
                                    placeholder="Arwen (prometida)..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 10: Info Adicional */}
                    {activeTab === 10 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Generales</label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                    value={formData.additional_info?.notes || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        additional_info: { ...formData.additional_info, notes: e.target.value }
                                    })}
                                    placeholder="Cualquier otra información relevante sobre el personaje..."
                                />
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Sección {activeTab + 1} de {tabs.length}
                    </div>
                    <div className="flex gap-3">
                        {activeTab > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab(activeTab - 1)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                ← Anterior
                            </button>
                        )}
                        {activeTab < tabs.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setActiveTab(activeTab + 1)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Siguiente →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creando...' : '✓ Crear Personaje'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
