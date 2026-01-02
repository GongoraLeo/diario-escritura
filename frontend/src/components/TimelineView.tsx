import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { timelineService, getRandomColor, type TimelineTrack, type TimelineEvent } from '../services/timelineService';
import TimelineEventModal from './TimelineEventModal';
import { TimelineTrackItem } from './TimelineTrackItem';
import { TimelineEventItem } from './TimelineEventItem';
import { TimelineTrackBar } from './TimelineTrackBar';

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        loadTracks();
    }, [novelId]);

    const loadTracks = async () => {
        try {
            const response = await timelineService.getTracksByNovel(novelId);
            const sortedTracks = response.data.tracks.sort((a, b) => a.order - b.order);
            setTracks(sortedTracks);

            for (const track of sortedTracks) {
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
                order: tracks.length,
                max_units: 100
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

    const handleUpdateMaxUnits = async (trackId: string, units: number) => {
        if (units < 1) return;
        try {
            await timelineService.updateTrack(trackId, { max_units: units });
            loadTracks();
        } catch (error) {
            console.error('Error al actualizar unidades:', error);
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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id && tracks.find(t => t.id === active.id)) {
            const oldIndex = tracks.findIndex(t => t.id === active.id);
            const newIndex = tracks.findIndex(t => t.id === over.id);
            const newTracks = arrayMove(tracks, oldIndex, newIndex);
            setTracks(newTracks);

            try {
                await Promise.all(newTracks.map((track, index) =>
                    timelineService.updateTrack(track.id, { order: index })
                ));
            } catch (error) {
                console.error('Error al actualizar orden:', error);
                loadTracks();
            }
            return;
        }

        const activeData = active.data.current;
        if (activeData?.type === 'event') {
            const timelineEvent = activeData.event as TimelineEvent;
            const originalTrackId = activeData.trackId as string;
            const overData = over.data.current;
            let targetTrackId = originalTrackId;

            if (overData?.type === 'track-bar') {
                targetTrackId = overData.trackId;
            }

            const barElement = document.querySelector(`[data-track-bar-id="${targetTrackId}"]`);
            if (barElement) {
                const rect = barElement.getBoundingClientRect();
                const barWidth = rect.width || 1;

                // Usar el delta acumulado proporcionado por dnd-kit
                // Esto es mucho más fiable que calcularlo manualmente con clientX
                const deltaXPercent = (event.delta.x / barWidth) * 100;
                const currentPos = typeof timelineEvent.start_position === 'number' ? timelineEvent.start_position : 0;

                let newPosition = currentPos + deltaXPercent;
                const eventDuration = timelineEvent.duration || 10;

                newPosition = Math.max(0, Math.min(100 - eventDuration, newPosition));
                newPosition = Math.round(newPosition * 100) / 100;

                if (isNaN(newPosition)) newPosition = currentPos;

                if (newPosition !== timelineEvent.start_position || targetTrackId !== originalTrackId) {
                    try {
                        await timelineService.updateEvent(timelineEvent.id, {
                            start_position: newPosition,
                            track_id: targetTrackId
                        });

                        // Actualización optimista
                        setEvents(prev => {
                            const newState = { ...prev };
                            if (targetTrackId !== originalTrackId) {
                                newState[originalTrackId] = newState[originalTrackId].filter(e => e.id !== timelineEvent.id);
                                newState[targetTrackId] = [...(newState[targetTrackId] || []), { ...timelineEvent, start_position: newPosition, track_id: targetTrackId }];
                            } else {
                                newState[targetTrackId] = newState[targetTrackId].map(e =>
                                    e.id === timelineEvent.id ? { ...e, start_position: newPosition } : e
                                );
                            }
                            return newState;
                        });
                    } catch (error) {
                        console.error('Error al mover evento:', error);
                        loadTracks();
                    }
                }
            }
        }
    };

    if (loading) {
        return <div className="text-white text-center py-8">Cargando timeline...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTrack()}
                    placeholder="Nombre de nueva pista (Ej: Trama Principal, Personaje A...)"
                />
                <button
                    onClick={handleCreateTrack}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-all shadow-lg active:scale-95"
                >
                    + Nueva Pista
                </button>
            </div>

            {tracks.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
                    <div className="text-6xl mb-4">⏱️</div>
                    <p className="text-white text-xl font-bold mb-2">Timeline vacío</p>
                    <p className="text-purple-200">Crea pistas para organizar los eventos de tu historia.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-8">
                                {tracks.map((track) => (
                                    <TimelineTrackItem
                                        key={track.id}
                                        track={track}
                                        isEditing={editingTrackId === track.id}
                                        editingName={editingTrackName}
                                        onRename={() => {
                                            setEditingTrackId(track.id);
                                            setEditingTrackName(track.name);
                                        }}
                                        onDelete={() => handleDeleteTrack(track.id)}
                                        onEditingNameChange={setEditingTrackName}
                                        onEditingNameSubmit={() => handleRenameTrack(track.id)}
                                        headerActions={
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded border border-white/10">
                                                    <span className="text-[10px] text-purple-300 uppercase font-bold">Unidades:</span>
                                                    <input
                                                        type="number"
                                                        className="w-12 bg-transparent text-white text-[10px] outline-none"
                                                        value={track.max_units}
                                                        onChange={(e) => handleUpdateMaxUnits(track.id, parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleNewEvent(track)}
                                                    className="text-[10px] px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors uppercase tracking-wider"
                                                >
                                                    + Evento
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTrack(track.id)}
                                                    className="text-[10px] px-2 py-1 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white rounded transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        }
                                    >
                                        <div data-track-bar-id={track.id}>
                                            <TimelineTrackBar trackId={track.id}>
                                                {events[track.id]?.map((event) => (
                                                    <TimelineEventItem
                                                        key={event.id}
                                                        event={event}
                                                        track={track}
                                                        onClick={() => handleEditEvent(track, event)}
                                                    />
                                                ))}
                                            </TimelineTrackBar>
                                        </div>
                                    </TimelineTrackItem>
                                ))}
                            </div>
                        </SortableContext>

                        <div className="mt-8 flex text-[9px] text-purple-300 border-t border-white/10 pt-4 font-mono">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
                                // Usamos el max_units de la primera pista como referencia de la escala global
                                const referenceMax = tracks.length > 0 ? tracks[0].max_units : 100;
                                const currentVal = Math.round((step / 10) * referenceMax);
                                return (
                                    <div key={step} className="flex-1 text-center relative">
                                        <div className="absolute left-1/2 -top-4 w-px h-2 bg-white/20" />
                                        {currentVal}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DndContext>
            )}

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
