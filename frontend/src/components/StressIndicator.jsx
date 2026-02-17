/**
 * Displays a colored badge indicating stress level category.
 * Green = Low, Yellow = Moderate, Red = High
 */
export default function StressIndicator({ category, percentage }) {
    const config = {
        Low: {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-800 dark:text-green-200',
            border: 'border-green-300 dark:border-green-700',
            emoji: '😊',
        },
        Moderate: {
            bg: 'bg-yellow-100 dark:bg-yellow-900',
            text: 'text-yellow-800 dark:text-yellow-200',
            border: 'border-yellow-300 dark:border-yellow-700',
            emoji: '😐',
        },
        High: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-800 dark:text-red-200',
            border: 'border-red-300 dark:border-red-700',
            emoji: '😰',
        },
    };

    const c = config[category] || config.Low;

    return (
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
            <span className="text-lg">{c.emoji}</span>
            <span className="font-semibold">{category}</span>
            {percentage !== undefined && (
                <span className="text-sm opacity-75">({percentage}%)</span>
            )}
        </div>
    );
}
