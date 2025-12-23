import { useEffect, useState } from 'react';
import { authService, type User } from '../services/authService';
import { novelService, type Novel } from '../services/novelService';
import CreateNovelModal from './CreateNovelModal';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [novels, setNovels] = useState<Novel[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('novelas');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    const response = await authService.getProfile();
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        if (!authService.isAuthenticated()) {
            window.location.href = '/login';
        } else {
            loadUser();
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadNovels();
        }
    }, [user]);

    const loadNovels = async () => {
        try {
            const response = await novelService.getAll();
            setNovels(response.data.novels);
        } catch (error) {
            console.error('Error al cargar novelas:', error);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const handleNovelCreated = () => {
        loadNovels();
    };

    const getRandomGradient = (index: number) => {
        const gradients = [
            'from-orange-400 to-pink-500',
            'from-purple-400 to-indigo-500',
            'from-teal-400 to-cyan-500',
            'from-rose-400 to-red-500',
            'from-amber-400 to-orange-500',
            'from-emerald-400 to-green-500',
        ];
        return gradients[index % gradients.length];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        return `Hace ${Math.floor(diffDays / 30)} meses`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-teal-800 to-purple-900">
                <div className="text-xl text-white">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-900 via-teal-800 to-purple-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col">
                <div className="p-6 border-b border-white/20">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        Diario de Escritura
                    </h1>
                    <p className="text-sm text-purple-200">
                        {user?.full_name || user?.username}
                    </p>
                </div>

                <nav className="flex-1 p-4">
                    <button
                        onClick={() => setActiveSection('novelas')}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${activeSection === 'novelas'
                                ? 'bg-white/20 text-white font-medium'
                                : 'text-purple-100 hover:bg-white/10'
                            }`}
                    >
                        📚 Mis Novelas
                    </button>
                    <button
                        onClick={() => setActiveSection('estadisticas')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'estadisticas'
                                ? 'bg-white/20 text-white font-medium'
                                : 'text-purple-100 hover:bg-white/10'
                            }`}
                    >
                        📊 Estadísticas
                    </button>
                </nav>

                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {activeSection === 'novelas' && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold text-white mb-2">
                                    Mis Novelas
                                </h2>
                                <p className="text-purple-200">
                                    Gestiona tus proyectos de escritura
                                </p>
                            </div>

                            {/* Grid de Novelas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Card: Nueva Novela */}
                                <div
                                    className="group cursor-pointer"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <div className="bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 hover:border-orange-400 hover:bg-white/20 rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px]">
                                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                            ➕
                                        </div>
                                        <p className="text-white font-semibold text-lg">
                                            Crear Nueva Novela
                                        </p>
                                        <p className="text-purple-200 text-sm mt-2">
                                            Comienza un nuevo proyecto
                                        </p>
                                    </div>
                                </div>

                                {/* Novelas del usuario */}
                                {novels.map((novel, index) => (
                                    <div key={novel.id} className="group cursor-pointer">
                                        <div className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl overflow-hidden transition-all duration-300 border border-white/20 hover:border-teal-400">
                                            {/* Cover */}
                                            <div className={`h-40 bg-gradient-to-br ${getRandomGradient(index)} relative`}>
                                                <div className="absolute inset-0 bg-black/20"></div>
                                            </div>
                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-white mb-2">
                                                    {novel.title}
                                                </h3>
                                                <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                                                    {novel.description || 'Sin descripción'}
                                                </p>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-teal-300 font-medium">
                                                        {novel.word_count.toLocaleString()} palabras
                                                    </span>
                                                    <span className="text-purple-300">
                                                        {formatDate(novel.updated_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'estadisticas' && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold text-white mb-2">
                                    Estadísticas
                                </h2>
                                <p className="text-purple-200">
                                    Tu progreso como escritor
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-purple-500/30 to-purple-700/30 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                                    <div className="text-4xl font-bold text-white mb-2">{novels.length}</div>
                                    <div className="text-purple-200">Novelas</div>
                                </div>
                                <div className="bg-gradient-to-br from-teal-500/30 to-teal-700/30 backdrop-blur-md rounded-2xl p-6 border border-teal-400/30">
                                    <div className="text-4xl font-bold text-white mb-2">0</div>
                                    <div className="text-teal-200">Personajes</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500/30 to-orange-700/30 backdrop-blur-md rounded-2xl p-6 border border-orange-400/30">
                                    <div className="text-4xl font-bold text-white mb-2">0</div>
                                    <div className="text-orange-200">Escenas</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500/30 to-pink-700/30 backdrop-blur-md rounded-2xl p-6 border border-pink-400/30">
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {novels.reduce((total, novel) => total + novel.word_count, 0).toLocaleString()}
                                    </div>
                                    <div className="text-pink-200">Palabras Totales</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Modal */}
            <CreateNovelModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleNovelCreated}
            />
        </div>
    );
}
