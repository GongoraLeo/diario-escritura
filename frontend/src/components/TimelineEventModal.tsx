import { useState } from 'react';
import { timelineService, getRandomColor, type CreateEventData } from '../services/timelineService';

interface TimelineEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    trackId: string;
    trackColor: string;
    existingEvent?: any;
}

export default function TimelineEventModal({ isOpen, onClose, onSuccess, trackId, trackColor, existingEvent }: TimelineEventModalProps) {
    const [formData, setFormData] = useState<CreateEventData>(existingEvent || {
        track_id: trackId,
        title: '',
        description: '',
        start_position: 0,
        duration: 10,
        color: trackColor
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('El título del evento es obligatorio');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (existingEvent) {
                await timelineService.updateEvent(existingEvent.id, formData);
            } else {
                await timelineService.createEvent(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar el evento');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {existingEvent ? 'Editar Evento' : 'Nuevo Evento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título del Evento *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Batalla de Helm's Deep"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción del evento..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Posición Inicial (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.start_position}
                                onChange={(e) => setFormData({ ...formData, start_position: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración (%)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : '✓ Guardar Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
