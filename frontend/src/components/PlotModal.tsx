import { useState } from 'react';
import { plotService, plotStructures, type CreatePlotData } from '../services/plotService';

interface PlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    novelId: string;
    existingPlot?: any;
}

export default function PlotModal({ isOpen, onClose, onSuccess, novelId, existingPlot }: PlotModalProps) {
    const [step, setStep] = useState<'select' | 'edit'>(existingPlot ? 'edit' : 'select');
    const [selectedStructure, setSelectedStructure] = useState<string>(existingPlot?.structure_type || '');
    const [plotPoints, setPlotPoints] = useState<any>(existingPlot?.plot_points || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStructureSelect = (structureType: string) => {
        setSelectedStructure(structureType);
        setStep('edit');
        // Inicializar plot_points vacío para la estructura seleccionada
        const structure = plotStructures[structureType as keyof typeof plotStructures];
        const initialPoints: any = {};
        structure.fields.forEach(field => {
            initialPoints[field.key] = '';
        });
        setPlotPoints(initialPoints);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: CreatePlotData = {
                novel_id: novelId,
                structure_type: selectedStructure as any,
                plot_points: plotPoints
            };

            await plotService.createOrUpdate(data);
            onSuccess();
            onClose();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la trama');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep('select');
        setSelectedStructure('');
        setPlotPoints({});
    };

    if (!isOpen) return null;

    const currentStructure = selectedStructure ? plotStructures[selectedStructure as keyof typeof plotStructures] : null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 'select' ? 'Selecciona una Estructura de Trama' : currentStructure?.name}
                        </h2>
                        <button
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    {step === 'edit' && currentStructure && (
                        <p className="text-sm text-gray-600 mt-2">{currentStructure.description}</p>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {step === 'select' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(plotStructures).map(([key, structure]) => (
                                <button
                                    key={key}
                                    onClick={() => handleStructureSelect(key)}
                                    className="p-6 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all text-left group hover:shadow-lg"
                                >
                                    <div className="text-4xl mb-3">{structure.icon}</div>
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                                        {structure.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{structure.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'edit' && currentStructure && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {currentStructure.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    {field.multiline ? (
                                        <textarea
                                            rows={field.rows || 4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                            value={plotPoints[field.key] || ''}
                                            onChange={(e) => setPlotPoints({ ...plotPoints, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                        />
                                    ) : (
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                            value={plotPoints[field.key] || ''}
                                            onChange={(e) => setPlotPoints({ ...plotPoints, [field.key]: e.target.value })}
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                </div>
                            ))}
                        </form>
                    )}
                </div>

                {/* Footer */}
                {step === 'edit' && (
                    <div className="p-6 border-t border-gray-200 flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('select');
                                setSelectedStructure('');
                                setPlotPoints({});
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                        >
                            ← Cambiar Estructura
                        </button>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    resetForm();
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : '✓ Guardar Trama'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
