import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Assessment() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/assessment/questions');
                setQuestions(res.data.questions);
                // Initialize answers to empty
                const init = {};
                res.data.questions.forEach((q) => { init[q.id] = 0; });
                setAnswers(init);
            } catch (err) {
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswer = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] >= 1);

    const handleSubmit = async () => {
        if (!allAnswered) return;
        setSubmitting(true);
        setError('');

        try {
            const orderedAnswers = questions.map((q) => answers[q.id]);
            const res = await api.post('/assessment/submit', { answers: orderedAnswers });
            setResult(res.data.assessment);
        } catch (err) {
            setError(err.response?.data?.error || 'Submission failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Show result after submission
    if (result) {
        const bgColor = result.category === 'Low' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
            : result.category === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';

        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className={`rounded-xl border p-8 text-center ${bgColor}`}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Assessment Complete!</h2>
                    <p className="text-5xl font-bold my-4 text-gray-900 dark:text-white">{result.stress_percentage}%</p>
                    <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                        Score: <strong>{result.score}/50</strong>
                    </p>
                    <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                        Stress Level: <strong>{result.category}</strong>
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                        >
                            View Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/resources')}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition"
                        >
                            Get Help
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stress Assessment</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree). Takes about 3 minutes.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                </div>
            )}

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Object.values(answers).filter((v) => v >= 1).length}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${(Object.values(answers).filter((v) => v >= 1).length / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white mb-4">
                            <span className="text-primary-600 mr-2">{idx + 1}.</span>
                            {q.text}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg text-sm font-medium border transition ${answers[q.id] === val
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-400'
                                        }`}
                                >
                                    <span className="block text-center">{val}</span>
                                    <span className="block text-center text-xs opacity-75 hidden sm:block">{labels[val - 1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitting}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </div>
        </div>
    );
}
