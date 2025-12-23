import { useEffect, useState } from 'react';
import { authService, type User } from '../services/authService';

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    // Si no hay usuario en localStorage, obtenerlo de la API
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

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-700">
                                Diario de Escritura
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">
                                Hola, <span className="font-medium">{user?.full_name || user?.username}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Mis Novelas
                    </h2>
                    <p className="text-gray-600">
                        Gestiona tus proyectos de escritura
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card: Nueva Novela */}
                    <div className="card border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]">
                        <div className="text-center">
                            <div className="text-5xl text-gray-400 mb-2">+</div>
                            <p className="text-gray-600 font-medium">Crear Nueva Novela</p>
                        </div>
                    </div>

                    {/* Placeholder cards */}
                    <div className="card">
                        <div className="h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Mi Primera Novela
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Una historia épica de aventuras...
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>0 palabras</span>
                            <span>Hace 2 días</span>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Estadísticas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
                            <div className="text-3xl font-bold text-primary-700 mb-1">0</div>
                            <div className="text-gray-600">Novelas</div>
                        </div>
                        <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
                            <div className="text-3xl font-bold text-accent-700 mb-1">0</div>
                            <div className="text-gray-600">Personajes</div>
                        </div>
                        <div className="card bg-gradient-to-br from-warm-50 to-warm-100">
                            <div className="text-3xl font-bold text-warm-700 mb-1">0</div>
                            <div className="text-gray-600">Escenas</div>
                        </div>
                        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                            <div className="text-3xl font-bold text-purple-700 mb-1">0</div>
                            <div className="text-gray-600">Palabras</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
