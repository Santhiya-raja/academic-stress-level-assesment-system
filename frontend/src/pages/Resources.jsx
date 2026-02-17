import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Resources() {
    const [grouped, setGrouped] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources');
                setGrouped(res.data.grouped);
            } catch (err) {
                console.error('Failed to fetch resources:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const categories = Object.keys(grouped);
    const categoryIcons = {
        'Time Management': '⏰',
        'Meditation': '🧘',
        'Counseling': '💬',
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Help Resources</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Actionable resources to help you manage academic stress effectively.
            </p>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === null
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {categoryIcons[cat] || '📋'} {cat}
                    </button>
                ))}
            </div>

            {/* Resource Cards */}
            {categories
                .filter((cat) => activeCategory === null || cat === activeCategory)
                .map((cat) => (
                    <div key={cat} className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                            <span>{categoryIcons[cat] || '📋'}</span>
                            <span>{cat}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {grouped[cat].map((r) => (
                                <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{r.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.description}</p>
                                    {r.action_type === 'link' && (
                                        <span className="inline-block mt-3 text-xs text-primary-600 dark:text-primary-400 font-medium">
                                            🔗 External Resource
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}
