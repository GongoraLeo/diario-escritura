import { useEffect, useState } from 'react';
import { novelService, type Novel } from '../services/novelService';
import { characterService, type Character } from '../services/characterService';
import CreateCharacterModal from './CreateCharacterModal';

interface NovelDetailProps {
    novelId: string;
}

export default function NovelDetail({ novelId }: NovelDetailProps) {
    const [novel, setNovel] = useState<Novel | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('resumen');
    const [showCharacterModal, setShowCharacterModal] = useState(false);

    useEffect(() => {
        loadNovel();
        loadCharacters();
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

    const handleCharacterCreated = () => {
        loadCharacters();
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
    ];

    return (
        <div className="flex h-full">
            {/* Sidebar de secciones */}
            <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20">
                <div className="p-6 border-b border-white/20">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="text-purple-200 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Volver
                    </button>
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
                            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                                Configurar Trama
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">📖</div>
                            <p className="text-white text-lg mb-2">Estructura de trama no configurada</p>
                            <p className="text-purple-200">Elige entre 3 actos, 5 actos, Viaje del Héroe, Save the Cat, etc.</p>
                        </div>
                    </div>
                )}

                {activeSection === 'escaleta' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Escaleta de Escenas</h2>
                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                                + Nueva Escena
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-white text-lg mb-2">No hay escenas planificadas</p>
                            <p className="text-purple-200">Crea tu primera escena en la escaleta</p>
                        </div>
                    </div>
                )}

                {activeSection === 'timeline' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Línea de Tiempo</h2>
                            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                                + Nueva Pista
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">⏱️</div>
                            <p className="text-white text-lg mb-2">Timeline vacío</p>
                            <p className="text-purple-200">Crea pistas para organizar los eventos de tu historia</p>
                        </div>
                    </div>
                )}

                {activeSection === 'escenas' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Escenas Escritas</h2>
                            <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors">
                                + Escribir Escena
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">✍️</div>
                            <p className="text-white text-lg mb-2">No hay escenas escritas</p>
                            <p className="text-purple-200">Comienza a escribir tu primera escena</p>
                        </div>
                    </div>
                )}

                {activeSection === 'apuntes-estilo' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Apuntes de Estilo</h2>
                            <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors">
                                + Nuevo Apunte
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">🎨</div>
                            <p className="text-white text-lg mb-2">No hay apuntes de estilo</p>
                            <p className="text-purple-200">Guarda notas sobre el tono, voz narrativa, etc.</p>
                        </div>
                    </div>
                )}

                {activeSection === 'apuntes-argumentales' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">Apuntes Argumentales</h2>
                            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
                                + Nuevo Apunte
                            </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">💡</div>
                            <p className="text-white text-lg mb-2">No hay apuntes argumentales</p>
                            <p className="text-purple-200">Anota ideas sobre la trama, giros, etc.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal de Personajes */}
            <CreateCharacterModal
                isOpen={showCharacterModal}
                onClose={() => setShowCharacterModal(false)}
                onSuccess={handleCharacterCreated}
                novelId={novelId}
            />
        </div>
    );
}
