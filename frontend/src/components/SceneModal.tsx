import { useState } from 'react';
import { sceneService, timeOfDayOptions, statusOptions, type CreateSceneData } from '../services/sceneService';

interface SceneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    novelId: string;
    sceneNumber: number;
    existingScene?: any;
}

export default function SceneModal({ isOpen, onClose, onSuccess, novelId, sceneNumber, existingScene }: SceneModalProps) {
    const [formData, setFormData] = useState<CreateSceneData>(existingScene || {
        novel_id: novelId,
        scene_number: sceneNumber,
        location: '',
        time_of_day: 'day' as const,
        characters: [],
        pov: '',
        objective: '',
        description: '',
        language_features: [],
        themes: [],
        dramatic_beats: {},
        plot_connection: '',
        emotional_state: '',
        notes: '',
        status: 'draft' as const
    });

    const [characterInput, setCharacterInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [themeInput, setThemeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (existingScene) {
                await sceneService.update(existingScene.id, formData);
            } else {
                await sceneService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la escena');
        } finally {
            setLoading(false);
        }
    };

    const addCharacter = () => {
        if (characterInput.trim()) {
            setFormData({
                ...formData,
                characters: [...(formData.characters || []), characterInput.trim()]
            });
            setCharacterInput('');
        }
    };

    const removeCharacter = (index: number) => {
        setFormData({
            ...formData,
            characters: formData.characters?.filter((_, i) => i !== index)
        });
    };

    const addLanguageFeature = () => {
        if (languageInput.trim()) {
            setFormData({
                ...formData,
                language_features: [...(formData.language_features || []), languageInput.trim()]
            });
            setLanguageInput('');
        }
    };

    const removeLanguageFeature = (index: number) => {
        setFormData({
            ...formData,
            language_features: formData.language_features?.filter((_, i) => i !== index)
        });
    };

    const addTheme = () => {
        if (themeInput.trim()) {
            setFormData({
                ...formData,
                themes: [...(formData.themes || []), themeInput.trim()]
            });
            setThemeInput('');
        }
    };

    const removeTheme = (index: number) => {
        setFormData({
            ...formData,
            themes: formData.themes?.filter((_, i) => i !== index)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {existingScene ? 'Editar Escena' : `Nueva Escena #${sceneNumber}`}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Información Básica */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Localización</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Casa de Frodo, La Comarca"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora del Día</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={formData.time_of_day}
                                onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value as any })}
                            >
                                {timeOfDayOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.icon} {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Personajes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personajes en la Escena</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={characterInput}
                                onChange={(e) => setCharacterInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacter())}
                                placeholder="Nombre del personaje"
                            />
                            <button
                                type="button"
                                onClick={addCharacter}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Añadir
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.characters?.map((char, index) => (
                                <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {char}
                                    <button type="button" onClick={() => removeCharacter(index)} className="hover:text-orange-900">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* POV y Objetivo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Punto de Vista (POV)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={formData.pov}
                                onChange={(e) => setFormData({ ...formData, pov: e.target.value })}
                                placeholder="Frodo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Emocional</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={formData.emotional_state}
                                onChange={(e) => setFormData({ ...formData, emotional_state: e.target.value })}
                                placeholder="Nervioso, esperanzado"
                            />
                        </div>
                    </div>

                    {/* Objetivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo de la Escena</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            value={formData.objective}
                            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                            placeholder="Frodo debe decidir si acepta llevar el anillo..."
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Resumen de lo que sucede en la escena..."
                        />
                    </div>

                    {/* Características de Lenguaje */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Características de Lenguaje</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguageFeature())}
                                placeholder="Ej: Diálogos rápidos, metáforas..."
                            />
                            <button
                                type="button"
                                onClick={addLanguageFeature}
                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                Añadir
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.language_features?.map((feature, index) => (
                                <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {feature}
                                    <button type="button" onClick={() => removeLanguageFeature(index)} className="hover:text-teal-900">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Temas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temas a Tratar</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={themeInput}
                                onChange={(e) => setThemeInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTheme())}
                                placeholder="Ej: Sacrificio, amistad..."
                            />
                            <button
                                type="button"
                                onClick={addTheme}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                            >
                                Añadir
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.themes?.map((theme, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {theme}
                                    <button type="button" onClick={() => removeTheme(index)} className="hover:text-purple-900">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Conexión con Trama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conexión con la Trama</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            value={formData.plot_connection}
                            onChange={(e) => setFormData({ ...formData, plot_connection: e.target.value })}
                            placeholder="Cómo esta escena avanza la trama principal..."
                        />
                    </div>

                    {/* Notas y Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Notas adicionales..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : '✓ Guardar Escena'}
                    </button>
                </div>
            </div>
        </div>
    );
}
