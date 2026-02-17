import { useState, useEffect } from 'react';
import api from '../api/axios';
import StressIndicator from '../components/StressIndicator';
import { Link } from 'react-router-dom';

export default function Recommendations() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/assessment/metrics')
            .then(res => setMetrics(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    const pct = metrics?.current_percentage || 0;
    const category = pct <= 40 ? 'Low' : pct <= 70 ? 'Moderate' : 'High';

    const tips = {
        Low: [
            { emoji: '✅', title: 'Maintain Your Habits', desc: 'Your stress levels are healthy! Keep up good sleep, exercise, and study routines.' },
            { emoji: '📊', title: 'Regular Check-ins', desc: 'Continue periodic assessments to catch changes early.' },
            { emoji: '🎯', title: 'Set New Goals', desc: 'Great time to challenge yourself with new academic goals.' },
        ],
        Moderate: [
            { emoji: '📅', title: 'Time Management', desc: 'Use the Pomodoro technique. Plan your week ahead every Sunday.' },
            { emoji: '😴', title: 'Prioritize Sleep', desc: 'Aim for 7-8 hours. Avoid screens 30 min before bed.' },
            { emoji: '🏃', title: 'Physical Activity', desc: 'A 20-min walk reduces cortisol. Exercise 3-4 times a week.' },
            { emoji: '💬', title: 'Talk to Someone', desc: 'Share concerns with friends, family, or a counselor.' },
        ],
        High: [
            { emoji: '🚨', title: 'Seek Professional Help', desc: 'Visit your campus counseling center for free, confidential support.' },
            { emoji: '🧘', title: 'Meditation & Breathing', desc: 'Practice 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.' },
            { emoji: '⏸️', title: 'Take Breaks', desc: 'Step away every 45 min. Go outside, stretch, or enjoy something.' },
            { emoji: '📝', title: 'Simplify Your Load', desc: 'Prioritize commitments. Ask for deadline extensions when overwhelmed.' },
            { emoji: '🔕', title: 'Digital Detox', desc: 'Reduce social media. Set specific offline hours daily.' },
        ],
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recommendations</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Personalized suggestions based on your stress level.</p>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current stress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{pct}%</p>
                </div>
                <StressIndicator category={category} />
            </div>
            <div className="space-y-4">
                {(tips[category] || tips.Low).map((tip, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start space-x-3">
                            <span className="text-2xl">{tip.emoji}</span>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{tip.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tip.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <Link to="/resources" className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition">
                    Explore Help Resources →
                </Link>
            </div>
        </div>
    );
}
