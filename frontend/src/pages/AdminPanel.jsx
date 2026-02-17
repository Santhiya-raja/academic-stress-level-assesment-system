import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
    const [stats, setStats] = useState(null);
    const [deptStats, setDeptStats] = useState([]);
    const [highRisk, setHighRisk] = useState([]);
    const [deptFilter, setDeptFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, d, h] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/department-stats'),
                    api.get('/admin/high-risk'),
                ]);
                setStats(s.data);
                setDeptStats(d.data.department_stats);
                setHighRisk(h.data.high_risk_alerts);
            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleDeptFilter = async (dept) => {
        setDeptFilter(dept);
        try {
            const url = dept ? `/admin/department-stats?dept=${dept}` : '/admin/department-stats';
            const res = await api.get(url);
            setDeptStats(res.data.department_stats);
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    const o = stats?.overview || {};

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{o.total_students || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{o.total_assessments || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Stress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{o.average_percentage || 0}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">High Stress</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{o.high_count || 0}</p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Stress Distribution</h2>
                <div className="flex space-x-4">
                    <div className="flex-1 bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{o.low_count || 0}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Low</p>
                    </div>
                    <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{o.moderate_count || 0}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Moderate</p>
                    </div>
                    <div className="flex-1 bg-red-50 dark:bg-red-900/30 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{o.high_count || 0}</p>
                        <p className="text-sm text-red-600 dark:text-red-400">High</p>
                    </div>
                </div>
            </div>

            {/* Department Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Department Statistics</h2>
                    <select value={deptFilter} onChange={(e) => handleDeptFilter(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                        <option value="">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Department</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Students</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Assessments</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Avg %</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Low</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">Moderate</th>
                                <th className="pb-2 text-gray-500 dark:text-gray-400">High</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deptStats.map((d, i) => (
                                <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                                    <td className="py-2 text-gray-900 dark:text-white font-medium">{d.department}</td>
                                    <td className="py-2 text-gray-700 dark:text-gray-300">{d.total_students}</td>
                                    <td className="py-2 text-gray-700 dark:text-gray-300">{d.total_assessments}</td>
                                    <td className="py-2 text-gray-700 dark:text-gray-300">{d.average_percentage || 0}%</td>
                                    <td className="py-2 text-green-600">{d.low_count}</td>
                                    <td className="py-2 text-yellow-600">{d.moderate_count}</td>
                                    <td className="py-2 text-red-600">{d.high_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* High Risk Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                    🚨 High-Risk Alerts ({highRisk.length})
                </h2>
                {highRisk.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500">No high-risk alerts.</p>
                ) : (
                    <div className="space-y-3">
                        {highRisk.map((a) => (
                            <div key={a.alert_id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{a.student_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.student_email} • {a.department || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600 dark:text-red-400">{a.stress_percentage}%</p>
                                    <p className="text-xs text-gray-400">{new Date(a.alert_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
