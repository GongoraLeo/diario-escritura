import { useDraggable } from '@dnd-kit/core';
import { type TimelineTrack, type TimelineEvent } from '../services/timelineService';

interface TimelineEventItemProps {
    event: TimelineEvent;
    track: TimelineTrack;
    onClick: () => void;
}

function getContrastYIQ(hexcolor: string) {
    if (!hexcolor || hexcolor === 'transparent') return 'white';
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export function TimelineEventItem({ event, track, onClick }: TimelineEventItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: event.id,
        data: {
            type: 'event',
            event,
            trackId: track.id
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        opacity: 0.8,
    } : undefined;

    const textColor = getContrastYIQ(event.color || track.color);

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute top-1 bottom-1 rounded-md shadow-sm border border-black/10 cursor-move hover:ring-2 hover:ring-white/50 transition-all duration-200 group ${isDragging ? 'ring-2 ring-white/50 scale-105 z-50' : ''}`}
            style={{
                left: `${event.start_position}%`,
                width: `${event.duration}%`,
                backgroundColor: event.color || track.color,
                color: textColor,
                ...style
            }}
            onClick={(e) => {
                // Evitar que el drag dispare el click si ha habido movimiento
                if (!transform) {
                    e.stopPropagation();
                    onClick();
                }
            }}
        >
            <div className={`px-2 py-1 text-[10px] font-bold truncate select-none ${textColor === 'black' ? 'text-black/80' : 'text-white'}`}>
                {event.title}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                {event.title}
                {event.description && <div className="text-gray-400 text-[9px] truncate max-w-[150px]">{event.description}</div>}
            </div>
        </div>
    );
}
