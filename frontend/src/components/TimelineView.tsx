import { useState, useEffect } from 'react';
import { timelineService, getRandomColor, type TimelineTrack, type TimelineEvent } from '../services/timelineService';
import TimelineEventModal from './TimelineEventModal';

interface TimelineViewProps {
    novelId: string;
}

export default function TimelineView({ novelId }: TimelineViewProps) {
    const [tracks, setTracks] = useState<TimelineTrack[]>([]);
    const [events, setEvents] = useState<{ [trackId: string]: TimelineEvent[] }>({});
    const [loading, setLoading] = useState(true);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<TimelineTrack | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [newTrackName, setNewTrackName] = useState('');
    const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
    const [editingTrackName, setEditingTrackName] = useState('');

    useEffect(() => {
        loadTracks();
    }, [novelId]);

    const loadTracks = async () => {
        try {
            const response = await timelineService.getTracksByNovel(novelId);
            setTracks(response.data.tracks);

            // Cargar eventos para cada pista
            for (const track of response.data.tracks) {
                loadEventsForTrack(track.id);
            }
        } catch (error) {
            console.error('Error al cargar pistas:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEventsForTrack = async (trackId: string) => {
        try {
            const response = await timelineService.getEventsByTrack(trackId);
            setEvents(prev => ({ ...prev, [trackId]: response.data.events }));
        } catch (error) {
            console.error('Error al cargar eventos:', error);
        }
    };

    const handleCreateTrack = async () => {
        if (!newTrackName.trim()) return;

        try {
            await timelineService.createTrack({
                novel_id: novelId,
                name: newTrackName,
                color: getRandomColor(),
                order: tracks.length
            });
            setNewTrackName('');
            loadTracks();
        } catch (error) {
            console.error('Error al crear pista:', error);
        }
    };

    const handleRenameTrack = async (trackId: string) => {
        if (!editingTrackName.trim()) return;

        try {
            await timelineService.updateTrack(trackId, { name: editingTrackName });
            setEditingTrackId(null);
            setEditingTrackName('');
            loadTracks();
        } catch (error) {
            console.error('Error al renombrar pista:', error);
        }
    };

    const handleDeleteTrack = async (trackId: string) => {
        if (!confirm('¿Eliminar esta pista y todos sus eventos?')) return;

        try {
            await timelineService.deleteTrack(trackId);
            loadTracks();
        } catch (error) {
            console.error('Error al eliminar pista:', error);
        }
    };

    const handleNewEvent = (track: TimelineTrack) => {
        setSelectedTrack(track);
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleEditEvent = (track: TimelineTrack, event: TimelineEvent) => {
        setSelectedTrack(track);
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const handleEventSaved = () => {
        if (selectedTrack) {
            loadEventsForTrack(selectedTrack.id);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-8">Cargando timeline...</div>;
    }

    return (
        <div>
            {/* Nueva Pista */}
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTrack()}
                    placeholder="Nombre de nueva pista (ej: Frodo, Trama Principal, Rivendel...)"
                />
                <button
                    onClick={handleCreateTrack}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                >
                    + Nueva Pista
                </button>
            </div>

            {tracks.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                    <div className="text-6xl mb-4">⏱️</div>
                    <p className="text-white text-lg mb-2">Timeline vacío</p>
                    <p className="text-purple-200">Crea pistas para organizar los eventos de tu historia</p>
                </div>
            ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    {/* Timeline Grid */}
                    <div className="space-y-4">
                        {tracks.map((track) => (
                            <div key={track.id} className="border-b border-white/10 pb-4 last:border-0">
                                {/* Track Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: track.color }}
                                        />
                                        {editingTrackId === track.id ? (
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white outline-none"
                                                value={editingTrackName}
                                                onChange={(e) => setEditingTrackName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleRenameTrack(track.id)}
                                                onBlur={() => handleRenameTrack(track.id)}
                                                autoFocus
                                            />
                                        ) : (
                                            <h3
                                                className="font-semibold text-white cursor-pointer hover:text-cyan-300"
                                                onClick={() => {
                                                    setEditingTrackId(track.id);
                                                    setEditingTrackName(track.name);
                                                }}
                                            >
                                                {track.name}
                                            </h3>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleNewEvent(track)}
                                            className="text-sm px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
                                        >
                                            + Evento
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTrack(track.id)}
                                            className="text-sm px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-200 rounded transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Timeline Bar */}
                                <div className="relative h-12 bg-white/5 rounded-lg overflow-hidden">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex">
                                        {[...Array(10)].map((_, i) => (
                                            <div key={i} className="flex-1 border-r border-white/10 last:border-0" />
                                        ))}
                                    </div>

                                    {/* Events */}
                                    {events[track.id]?.map((event) => (
                                        <div
                                            key={event.id}
                                            className="absolute top-1 bottom-1 rounded cursor-pointer hover:opacity-80 transition-opacity group"
                                            style={{
                                                left: `${event.start_position}%`,
                                                width: `${event.duration}%`,
                                                backgroundColor: event.color || track.color
                                            }}
                                            onClick={() => handleEditEvent(track, event)}
                                        >
                                            <div className="px-2 py-1 text-xs text-white font-medium truncate">
                                                {event.title}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                                {event.title}
                                                {event.description && <div className="text-gray-300">{event.description}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Scale */}
                    <div className="mt-4 flex text-xs text-purple-300">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                            <div key={num} className="flex-1 text-center">
                                {num}%
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {selectedTrack && (
                <TimelineEventModal
                    isOpen={showEventModal}
                    onClose={() => setShowEventModal(false)}
                    onSuccess={handleEventSaved}
                    trackId={selectedTrack.id}
                    trackColor={selectedTrack.color}
                    existingEvent={selectedEvent}
                />
            )}
        </div>
    );
}
