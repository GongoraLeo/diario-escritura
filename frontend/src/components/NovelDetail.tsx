import { useEffect, useState } from 'react';
import { novelService, type Novel } from '../services/novelService';
import { characterService, type Character } from '../services/characterService';
import { plotService, plotStructures, type Plot } from '../services/plotService';
import { sceneService, timeOfDayOptions, statusOptions, type Scene } from '../services/sceneService';
import { noteService, type Note } from '../services/noteService';
import CreateCharacterModal from './CreateCharacterModal';
import PlotModal from './PlotModal';
import SceneModal from './SceneModal';
import TimelineView from './TimelineView';
import RichTextEditor from './RichTextEditor';
import ThemeToggle from './ThemeToggle';

interface NovelDetailProps {
    novelId: string;
}

export default function NovelDetail({ novelId }: NovelDetailProps) {
    const [novel, setNovel] = useState<Novel | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [plot, setPlot] = useState<Plot | null>(null);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [styleNotes, setStyleNotes] = useState<Note[]>([]);
    const [plotNotes, setPlotNotes] = useState<Note[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('resumen');
    const [showCharacterModal, setShowCharacterModal] = useState(false);
    const [showPlotModal, setShowPlotModal] = useState(false);
    const [showSceneModal, setShowSceneModal] = useState(false);
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
    const [sceneInEditor, setSceneInEditor] = useState<Scene | null>(null);
    const [noteInEditor, setNoteInEditor] = useState<Note | null>(null);

    useEffect(() => {
        loadNovel();
        loadCharacters();
        loadPlot();
        loadScenes();
        loadNotes();
        loadStats();
    }, [novelId]);

    const loadNovel = async () => {
        try {
            const response = await novelService.getById(novelId);
            setNovel(response.data);
        } catch (error) {
            console.error('Error al cargar novela:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCharacters = async () => {
        try {
            const response = await characterService.getByNovel(novelId);
            setCharacters(response.data.characters);
        } catch (error) {
            console.error('Error al cargar personajes:', error);
        }
    };

    const loadPlot = async () => {
        try {
            const response = await plotService.getByNovel(novelId);
            setPlot(response.data);
        } catch (error) {
            console.error('Error al cargar trama:', error);
        }
    };

    const loadScenes = async () => {
        try {
            const response = await sceneService.getByNovel(novelId);
            setScenes(response.data.scenes);
        } catch (error) {
            console.error('Error al cargar escenas:', error);
        }
    };

    const loadNotes = async () => {
        try {
            const styleRes = await noteService.getByNovel(novelId, 'style');
            setStyleNotes(styleRes.data.notes);
            const plotRes = await noteService.getByNovel(novelId, 'plot');
            setPlotNotes(plotRes.data.notes);
        } catch (error) {
            console.error('Error al cargar apuntes:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await novelService.getStats(novelId);
            setStats(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const handleCharacterCreated = () => {
        loadCharacters();
    };

    const handlePlotSaved = () => {
        loadPlot();
    };

    const handleSceneSaved = () => {
        loadScenes();
        setSelectedScene(null);
    };

    const handleNewScene = () => {
        setSelectedScene(null);
        setShowSceneModal(true);
    };

    const handleEditScene = (scene: Scene) => {
        setSelectedScene(scene);
        setShowSceneModal(true);
    };

    const handleSaveSceneContent = async (content: string) => {
        if (!sceneInEditor) return;
        try {
            await sceneService.update(sceneInEditor.id, { description: content });
            loadScenes();
        } catch (error) {
            console.error('Error al guardar contenido de escena:', error);
        }
    };

    const handleNewNote = async (type: 'style' | 'plot') => {
        try {
            const title = type === 'style' ? 'Nuevo apunté de estilo' : 'Nuevo apunte de trama';
            const response = await noteService.create({ novel_id: novelId, type, title });
            loadNotes();
            setNoteInEditor(response.data);
        } catch (error) {
            console.error('Error al crear apunte:', error);
        }
    };

    const handleSaveNoteContent = async (content: string) => {
        if (!noteInEditor) return;
        try {
            await noteService.update(noteInEditor.id, { content });
            loadNotes();
        } catch (error) {
            console.error('Error al guardar contenido de apunte:', error);
        }
    };

    const handleSaveNoteTitle = async (title: string) => {
        if (!noteInEditor) return;
        try {
            await noteService.update(noteInEditor.id, { title });
            loadNotes();
        } catch (error) {
            console.error('Error al guardar título de apunte:', error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este apunte?')) return;
        try {
            await noteService.delete(id);
            if (noteInEditor?.id === id) setNoteInEditor(null);
            loadNotes();
        } catch (error) {
            console.error('Error al eliminar apunte:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl">Cargando novela...</div>
            </div>
        );
    }

    if (!novel) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl">Novela no encontrada</div>
            </div>
        );
    }

    const menuItems = [
        { id: 'resumen', icon: '📋', label: 'Resumen' },
        { id: 'personajes', icon: '👥', label: 'Personajes' },
        { id: 'tramas', icon: '📖', label: 'Tramas' },
        { id: 'escaleta', icon: '📋', label: 'Escaleta' },
        { id: 'timeline', icon: '⏱️', label: 'Línea de Tiempo' },
        { id: 'escenas', icon: '✍️', label: 'Escenas' },
        { id: 'apuntes-estilo', icon: '🎨', label: 'Apuntes de Estilo' },
        { id: 'apuntes-argumentales', icon: '💡', label: 'Apuntes Argumentales' },
        { id: 'estadisticas', icon: '📊', label: 'Estadísticas' },
    ];

    return (
        <div className="flex h-full">
            {/* Sidebar de secciones */}
            <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20">
                <div className="p-6 border-b border-white/20">
                    <div className="flex justify-between items-start mb-4">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="text-purple-200 hover:text-white flex items-center gap-2"
                        >
                            ← Volver
                        </button>
                        <ThemeToggle />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                        {novel.title}
                    </h2>
                    <p className="text-sm text-purple-200">
                        {novel.word_count.toLocaleString()} palabras
                    </p>
                </div>

                <nav className="p-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${activeSection === item.id
                                ? 'bg-white/20 text-white font-medium'
                                : 'text-purple-100 hover:bg-white/10'
                                }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 overflow-y-auto p-8">
                {activeSection === 'resumen' && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Resumen</h2>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Título</h3>
                                <p className="text-purple-100 text-xl">{novel.title}</p>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                                <p className="text-purple-100">
                                    {novel.description || 'Sin descripción'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-white">{novel.word_count.toLocaleString()}</div>
                                    <div className="text-purple-200 text-sm">Palabras</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-white">{characters.length}</div>
                                    <div className="text-purple-200 text-sm">Personajes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'personajes' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Personajes</h2>
                            <button
                                onClick={() => setShowCharacterModal(true)}
                                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                            >
                                + Nuevo Personaje
                            </button>
                        </div>

                        {characters.length === 0 ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                <div className="text-6xl mb-4">👥</div>
                                <p className="text-white text-lg mb-2">Aún no hay personajes</p>
                                <p className="text-purple-200">Crea tu primer personaje para comenzar</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {characters.map((character) => (
                                    <div key={character.id} className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl overflow-hidden transition-all duration-300 border border-white/20 hover:border-teal-400 cursor-pointer">
                                        {/* Avatar */}
                                        <div className="h-48 bg-gradient-to-br from-teal-400 to-cyan-500 relative flex items-center justify-center">
                                            {character.avatar ? (
                                                <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-6xl">👤</div>
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {character.name}
                                            </h3>
                                            <div className="space-y-1 text-sm">
                                                {character.personal_data?.age && (
                                                    <p className="text-purple-200">
                                                        <span className="text-teal-300">Edad:</span> {character.personal_data.age}
                                                    </p>
                                                )}
                                                {character.personal_data?.occupation && (
                                                    <p className="text-purple-200">
                                                        <span className="text-teal-300">Ocupación:</span> {character.personal_data.occupation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'tramas' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Estructura de Trama</h2>
                            <button
                                onClick={() => setShowPlotModal(true)}
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                            >
                                {plot ? 'Editar Trama' : 'Configurar Trama'}
                            </button>
                        </div>

                        {!plot ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                <div className="text-6xl mb-4">📖</div>
                                <p className="text-white text-lg mb-2">Estructura de trama no configurada</p>
                                <p className="text-purple-200">Elige entre 3 actos, 5 actos, Viaje del Héroe, Save the Cat, etc.</p>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
                                    <div className="text-4xl">
                                        {plotStructures[plot.structure_type]?.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {plotStructures[plot.structure_type]?.name}
                                        </h3>
                                        <p className="text-sm text-purple-200">
                                            {plotStructures[plot.structure_type]?.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {plotStructures[plot.structure_type]?.fields.map((field) => (
                                        plot.plot_points[field.key] && (
                                            <div key={field.key} className="bg-white/5 rounded-lg p-4">
                                                <h4 className="font-semibold text-white mb-2">{field.label}</h4>
                                                <p className="text-purple-100 whitespace-pre-wrap">
                                                    {plot.plot_points[field.key]}
                                                </p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'escaleta' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Escaleta de Escenas</h2>
                            <button
                                onClick={handleNewScene}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                            >
                                + Nueva Escena
                            </button>
                        </div>

                        {scenes.length === 0 ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                <div className="text-6xl mb-4">📋</div>
                                <p className="text-white text-lg mb-2">No hay escenas planificadas</p>
                                <p className="text-purple-200">Crea tu primera escena en la escaleta</p>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">#</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Localización</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Hora</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Personajes</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">POV</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Objetivo</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Estado</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scenes.map((scene) => (
                                                <tr key={scene.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-white font-medium">{scene.scene_number}</td>
                                                    <td className="px-4 py-3 text-purple-100">{scene.location || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-purple-100">
                                                            {timeOfDayOptions.find(t => t.value === scene.time_of_day)?.icon}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {scene.characters?.slice(0, 2).map((char, i) => (
                                                                <span key={i} className="text-xs bg-orange-500/20 text-orange-200 px-2 py-1 rounded">
                                                                    {char}
                                                                </span>
                                                            ))}
                                                            {scene.characters && scene.characters.length > 2 && (
                                                                <span className="text-xs text-purple-300">+{scene.characters.length - 2}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-purple-100">{scene.pov || '-'}</td>
                                                    <td className="px-4 py-3 text-purple-100 max-w-xs truncate">{scene.objective || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${scene.status === 'complete' ? 'bg-green-500/20 text-green-200' :
                                                            scene.status === 'revision' ? 'bg-orange-500/20 text-orange-200' :
                                                                'bg-gray-500/20 text-gray-200'
                                                            }`}>
                                                            {statusOptions.find(s => s.value === scene.status)?.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleEditScene(scene)}
                                                            className="text-teal-300 hover:text-teal-100 transition-colors"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'timeline' && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Línea de Tiempo</h2>
                        <TimelineView novelId={novelId} />
                    </div>
                )}

                {activeSection === 'escenas' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-3xl font-bold text-white">Escenas Escritas</h2>
                            <div className="flex gap-2">
                                {sceneInEditor && (
                                    <button
                                        onClick={() => setSceneInEditor(null)}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Volver a la Lista
                                    </button>
                                )}
                                <button
                                    onClick={handleNewScene}
                                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    + Nueva Escena
                                </button>
                            </div>
                        </div>

                        {!sceneInEditor ? (
                            scenes.length === 0 ? (
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                    <div className="text-6xl mb-4">✍️</div>
                                    <p className="text-white text-lg mb-2">No hay escenas escritas</p>
                                    <p className="text-purple-200">Comienza a escribir tu primera escena</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                                    {scenes.map((scene) => (
                                        <div
                                            key={scene.id}
                                            onClick={() => setSceneInEditor(scene)}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-pink-400 font-bold">#{scene.scene_number}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${scene.status === 'complete' ? 'bg-green-500/20 text-green-200' :
                                                    scene.status === 'revision' ? 'bg-orange-500/20 text-orange-200' :
                                                        'bg-gray-500/20 text-gray-200'
                                                    }`}>
                                                    {statusOptions.find(s => s.value === scene.status)?.label}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-semibold mb-2 line-clamp-1">{scene.pov || 'Sin POV'} - {scene.location || 'Sin lugar'}</h3>
                                            <p className="text-purple-200 text-sm line-clamp-3 mb-4">{scene.description?.replace(/<[^>]*>/g, '') || 'Sin contenido...'}</p>
                                            <div className="flex justify-between items-center text-[10px] text-purple-300">
                                                <span>{scene.characters.slice(0, 2).join(', ')}{scene.characters.length > 2 ? '...' : ''}</span>
                                                <span className="group-hover:text-pink-400 transition-colors">Escribir →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Escena #{sceneInEditor.scene_number}: {sceneInEditor.pov}</h3>
                                    <div className="text-xs text-purple-300">Guardado automático activado</div>
                                </div>
                                <RichTextEditor
                                    content={sceneInEditor.description || ''}
                                    onChange={handleSaveSceneContent}
                                    className="flex-1 min-h-0"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'apuntes-estilo' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-3xl font-bold text-white text-glow-rose">Apuntes de Estilo</h2>
                            <div className="flex gap-2">
                                {noteInEditor && (
                                    <button
                                        onClick={() => setNoteInEditor(null)}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cerrar Nota
                                    </button>
                                )}
                                <button
                                    onClick={() => handleNewNote('style')}
                                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-rose-900/20"
                                >
                                    + Nuevo Apunte
                                </button>
                            </div>
                        </div>

                        {!noteInEditor ? (
                            styleNotes.length === 0 ? (
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <p className="text-white text-lg mb-2">No hay apuntes de estilo</p>
                                    <p className="text-purple-200">Guarda notas sobre el tono, voz narrativa, etc.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
                                    {styleNotes.map((note) => (
                                        <div key={note.id} className="relative group">
                                            <div
                                                onClick={() => setNoteInEditor(note)}
                                                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-all cursor-pointer h-full"
                                            >
                                                <h3 className="text-white font-semibold mb-2 line-clamp-1 pr-6">{note.title}</h3>
                                                <p className="text-purple-200 text-sm line-clamp-4">{note.content?.replace(/<[^>]*>/g, '') || 'Sin contenido...'}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                                className="absolute top-2 right-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl p-6 border border-white/10">
                                <input
                                    type="text"
                                    value={noteInEditor.title}
                                    onChange={(e) => {
                                        setNoteInEditor({ ...noteInEditor, title: e.target.value });
                                        handleSaveNoteTitle(e.target.value);
                                    }}
                                    className="bg-transparent text-2xl font-bold text-white mb-4 border-none outline-none focus:ring-1 focus:ring-rose-500/30 rounded placeholder:text-white/20 w-full"
                                    placeholder="Título del apunte..."
                                />
                                <RichTextEditor
                                    content={noteInEditor.content || ''}
                                    onChange={handleSaveNoteContent}
                                    className="flex-1 min-h-0"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'apuntes-argumentales' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-3xl font-bold text-white text-glow-amber">Apuntes Argumentales</h2>
                            <div className="flex gap-2">
                                {noteInEditor && (
                                    <button
                                        onClick={() => setNoteInEditor(null)}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cerrar Nota
                                    </button>
                                )}
                                <button
                                    onClick={() => handleNewNote('plot')}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-amber-900/20"
                                >
                                    + Nuevo Apunte
                                </button>
                            </div>
                        </div>

                        {!noteInEditor ? (
                            plotNotes.length === 0 ? (
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                                    <div className="text-6xl mb-4">💡</div>
                                    <p className="text-white text-lg mb-2">No hay apuntes argumentales</p>
                                    <p className="text-purple-200">Anota ideas sobre la trama, giros, etc.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
                                    {plotNotes.map((note) => (
                                        <div key={note.id} className="relative group">
                                            <div
                                                onClick={() => setNoteInEditor(note)}
                                                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-all cursor-pointer h-full"
                                            >
                                                <h3 className="text-white font-semibold mb-2 line-clamp-1 pr-6">{note.title}</h3>
                                                <p className="text-purple-200 text-sm line-clamp-4">{note.content?.replace(/<[^>]*>/g, '') || 'Sin contenido...'}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                                className="absolute top-2 right-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl p-6 border border-white/10">
                                <input
                                    type="text"
                                    value={noteInEditor.title}
                                    onChange={(e) => {
                                        setNoteInEditor({ ...noteInEditor, title: e.target.value });
                                        handleSaveNoteTitle(e.target.value);
                                    }}
                                    className="bg-transparent text-2xl font-bold text-white mb-4 border-none outline-none focus:ring-1 focus:ring-amber-500/30 rounded placeholder:text-white/20 w-full"
                                    placeholder="Título del apunte..."
                                />
                                <RichTextEditor
                                    content={noteInEditor.content || ''}
                                    onChange={handleSaveNoteContent}
                                    className="flex-1 min-h-0"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'estadisticas' && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Métricas y Estadísticas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="text-purple-300 text-sm mb-1">Palabras Totales</div>
                                <div className="text-3xl font-bold text-white">{(stats?.word_count || novel.word_count).toLocaleString()}</div>
                                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-pink-500 rounded-full"
                                        style={{ width: `${Math.min(((stats?.word_count || novel.word_count) / 50000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-purple-400 mt-2 text-right">Meta: 50,000</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="text-purple-300 text-sm mb-1">Escenas Completas</div>
                                <div className="text-3xl font-bold text-white">
                                    {scenes.filter(s => s.status === 'complete').length} / {scenes.length}
                                </div>
                                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${(scenes.filter(s => s.status === 'complete').length / (scenes.length || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-purple-400 mt-2 text-right">Progreso escaleta</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="text-purple-300 text-sm mb-1">Personajes</div>
                                <div className="text-3xl font-bold text-white">{characters.length}</div>
                                <div className="mt-4 flex gap-1">
                                    {characters.slice(0, 5).map((char, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-[10px] text-orange-200">
                                            {char.name[0]}
                                        </div>
                                    ))}
                                    {characters.length > 5 && <div className="text-purple-400 text-[10px] flex items-center">+{characters.length - 5}</div>}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="text-purple-300 text-sm mb-1">Apuntes Totales</div>
                                <div className="text-3xl font-bold text-white">{styleNotes.length + plotNotes.length}</div>
                                <div className="text-xs text-purple-400 mt-2">
                                    {styleNotes.length} estilo | {plotNotes.length} trama
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-6">Distribución por Estado</h3>
                                <div className="space-y-4">
                                    {['draft', 'revision', 'complete'].map((status) => {
                                        const count = scenes.filter(s => s.status === status).length;
                                        const percentage = (count / (scenes.length || 1)) * 100;
                                        const label = statusOptions.find(o => o.value === status)?.label;
                                        const color = status === 'complete' ? 'bg-green-500' : status === 'revision' ? 'bg-orange-500' : 'bg-gray-500';

                                        return (
                                            <div key={status}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-purple-200">{label}</span>
                                                    <span className="text-white font-medium">{count} escenas</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-6">Información del Proyecto</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-purple-300">Creado</span>
                                        <span className="text-white">{new Date(novel.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-purple-300">Última actualización</span>
                                        <span className="text-white">{new Date(novel.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-purple-300">Tramas configuradas</span>
                                        <span className="text-white">{plot ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-purple-300">Promedio palabras/escena</span>
                                        <span className="text-white">
                                            {scenes.length > 0 ? Math.round(novel.word_count / scenes.length) : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modales */}
            <CreateCharacterModal
                isOpen={showCharacterModal}
                onClose={() => setShowCharacterModal(false)}
                onSuccess={handleCharacterCreated}
                novelId={novelId}
            />

            <PlotModal
                isOpen={showPlotModal}
                onClose={() => setShowPlotModal(false)}
                onSuccess={handlePlotSaved}
                novelId={novelId}
                existingPlot={plot}
            />

            <SceneModal
                isOpen={showSceneModal}
                onClose={() => setShowSceneModal(false)}
                onSuccess={handleSceneSaved}
                novelId={novelId}
                sceneNumber={scenes.length + 1}
                existingScene={selectedScene}
            />
        </div>
    );
}
