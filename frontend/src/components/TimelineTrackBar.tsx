import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface TimelineTrackBarProps {
    trackId: string;
    children: React.ReactNode;
}

export function TimelineTrackBar({ trackId, children }: TimelineTrackBarProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `track-bar-${trackId}`,
        data: {
            type: 'track-bar',
            trackId
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative h-12 bg-white/5 rounded-lg overflow-hidden transition-colors ${isOver ? 'bg-cyan-500/10 ring-2 ring-cyan-500/30' : ''}`}
        >
            {/* Grid lines */}
            <div className="absolute inset-0 flex pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-white/5 last:border-0" />
                ))}
            </div>

            {children}
        </div>
    );
}
