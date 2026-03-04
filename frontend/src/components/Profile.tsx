import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profile() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (err: any) {
                setError(err.response?.data?.msg || 'Failed to fetch profile. Please login again.');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (error) {
        return (
            <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => navigate('/login')} className="w-full bg-blue-500 text-white py-2 rounded">
                    Go to Login
                </button>
            </div>
        );
    }

    if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded">
                Logout
            </button>
        </div>
    );
}

export default Profile;
