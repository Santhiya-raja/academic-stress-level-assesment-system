import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                setProfile(res.data.user);
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const p = profile || user;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                            {p.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{p.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{p.role}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Department</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{p.department || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Member since</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(p.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
