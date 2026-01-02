import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type TimelineTrack } from '../services/timelineService';

interface TimelineTrackItemProps {
    track: TimelineTrack;
    headerActions?: React.ReactNode;
    children: React.ReactNode;
    onRename: () => void;
    onDelete: () => void;
    isEditing: boolean;
    editingName: string;
    onEditingNameChange: (name: string) => void;
    onEditingNameSubmit: () => void;
}

export function TimelineTrackItem({
    track,
    headerActions,
    children,
    onRename,
    onDelete,
    isEditing,
    editingName,
    onEditingNameChange,
    onEditingNameSubmit
}: TimelineTrackItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: track.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="border-b border-white/10 pb-6 last:border-0">
            {/* Track Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded text-purple-400"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </div>

                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: track.color }}
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white outline-none focus:ring-1 focus:ring-cyan-500"
                            value={editingName}
                            onChange={(e) => onEditingNameChange(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onEditingNameSubmit()}
                            onBlur={onEditingNameSubmit}
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="font-semibold text-white cursor-pointer hover:text-cyan-300 transition-colors"
                            onClick={onRename}
                        >
                            {track.name}
                        </h3>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {headerActions}
                </div>
            </div>
            {/* Timeline Bar Container */}
            <div className="pl-10">
                {children}
            </div>
        </div>
    );
}
