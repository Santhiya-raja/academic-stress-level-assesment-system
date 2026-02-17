import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Stressors() {
    const [stressors, setStressors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [adding, setAdding] = useState(false);

    const fetchStressors = async () => {
        try {
            const res = await api.get('/stressors');
            setStressors(res.data.stressors);
        } catch (err) {
            console.error('Failed to fetch stressors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStressors(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setAdding(true);
        setError('');
        try {
            await api.post('/stressors', {
                title: title.trim(),
                description: description.trim() || null,
                due_date: dueDate || null,
            });
            setTitle('');
            setDescription('');
            setDueDate('');
            fetchStressors();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add stressor.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/stressors/${id}`);
            setStressors((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Failed to delete stressor:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stressors</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Track what's causing you stress. Identifying stressors is the first step to managing them.
            </p>

            {/* Add Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Add a Stressor</h2>
                {error && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleAdd} className="space-y-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Project Deadline"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                        />
                        <button
                            type="submit"
                            disabled={adding || !title.trim()}
                            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {adding ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Stressor List */}
            {stressors.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <p className="text-lg mb-1">No stressors tracked yet</p>
                    <p className="text-sm">Add your first stressor above to start tracking.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {stressors.map((s) => (
                        <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">{s.title}</h3>
                                {s.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
                                )}
                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                                    {s.due_date && (
                                        <span>📅 Due: {new Date(s.due_date).toLocaleDateString()}</span>
                                    )}
                                    <span>Added: {new Date(s.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(s.id)}
                                className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                title="Delete stressor"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
