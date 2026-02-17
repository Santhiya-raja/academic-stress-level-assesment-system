import { useState, useEffect } from 'react';
import api from '../api/axios';
import StressChart from '../components/StressChart';
import StressIndicator from '../components/StressIndicator';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsRes, trendsRes, historyRes] = await Promise.all([
                    api.get('/assessment/metrics'),
                    api.get('/assessment/trends'),
                    api.get('/assessment/history'),
                ]);
                setMetrics(metricsRes.data);
                setTrends(trendsRes.data.trends);
                setHistory(historyRes.data.assessments.slice(0, 5));
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const getCategoryFromPercentage = (pct) => {
        if (pct <= 40) return 'Low';
        if (pct <= 70) return 'Moderate';
        return 'High';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your stress overview at a glance</p>
                </div>
                <Link
                    to="/assessment"
                    className="mt-4 sm:mt-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                >
                    Take Assessment
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Current Stress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Stress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.current_percentage || 0}%</p>
                    {metrics && metrics.current_percentage > 0 && (
                        <StressIndicator
                            category={getCategoryFromPercentage(metrics.current_percentage)}
                            percentage={undefined}
                        />
                    )}
                </div>

                {/* Average Stress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Stress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.average_percentage || 0}%</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Across {metrics?.total_assessments || 0} assessments
                    </p>
                </div>

                {/* Change */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Change</p>
                    <p className={`text-3xl font-bold ${(metrics?.percentage_change || 0) > 0
                            ? 'text-red-600 dark:text-red-400'
                            : (metrics?.percentage_change || 0) < 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                        }`}>
                        {(metrics?.percentage_change || 0) > 0 ? '+' : ''}{metrics?.percentage_change || 0}%
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">vs previous assessment</p>
                </div>

                {/* Total Assessments */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.total_assessments || 0}</p>
                    <Link to="/assessment" className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block">
                        Take another →
                    </Link>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stress Trends (Last 30 Days)</h2>
                <StressChart trends={trends} />
            </div>

            {/* Recent History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Assessments</h2>
                {history.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500">No assessments yet. Take your first one!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Score</th>
                                    <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                                    <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((a) => (
                                    <tr key={a.id} className="border-b border-gray-100 dark:border-gray-700/50">
                                        <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(a.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 text-sm text-gray-700 dark:text-gray-300">{a.score}/50</td>
                                        <td className="py-3">
                                            <StressIndicator category={a.category} />
                                        </td>
                                        <td className="py-3 text-sm text-gray-700 dark:text-gray-300">{a.stress_percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
