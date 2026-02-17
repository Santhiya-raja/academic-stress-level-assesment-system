import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

/**
 * Renders a stress trend line chart from trend data.
 * @param {{ trends: Array<{ date: string, stress_percentage: number }> }} props
 */
export default function StressChart({ trends }) {
    if (!trends || trends.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                No trend data available. Take assessments to see your trends.
            </div>
        );
    }

    // Format dates for display
    const data = trends.map((t) => ({
        ...t,
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stress_percentage: Number(t.stress_percentage),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} unit="%" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f9fafb',
                    }}
                    formatter={(value) => [`${value}%`, 'Stress Level']}
                />
                <Area
                    type="monotone"
                    dataKey="stress_percentage"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fill="url(#stressGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
