import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../shared/Footer';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Edit, Phone, UserCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { user, authenticatedFetch } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        id: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || 'Not provided',
                department: user.department || user.role || '',
                id: user.employeeId || user.adminId || user.id || ''
            });
        }
    }, [user]);

    const getUpdateProfilePath = () => {
        if (!user) return '/';
        switch (user.role?.toLowerCase()) {
            case 'admin':
                return '/admin/update-profile';
            case 'official':
                switch (user.department?.toLowerCase()) {
                    case 'rto':
                        return '/official-dashboard/rto/update-profile';
                    case 'water':
                        return '/official-dashboard/water/update-profile';
                    case 'electricity':
                        return '/official-dashboard/electricity/update-profile';
                    default:
                        return '/official/update-profile';
                }
            case 'petitioner':
                return '/update-profile';
            default:
                return '/';
        }
    };

    const handleUpdateProfileClick = () => {
        navigate(getUpdateProfilePath());
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authenticatedFetch('/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Password updated successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update password');
            console.error('Password update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <NavBar />
            <div className="container py-4 flex-grow-1">
                <div className="row">
                    <div className="col-12 col-md-3 mb-4 mb-md-0">
                        <div className="card h-100">
                            <div className="list-group list-group-flush">
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <User className="me-3" /> Profile Information
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'password' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('password')}
                                >
                                    <Lock className="me-3" /> Password Management
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'theme' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('theme')}
                                >
                                    <Sun className="me-3" /> Theme
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-9">
                        {activeTab === 'profile' && (
                            <div className={`card shadow-sm ${theme === 'dark' ? 'text-bg-dark' : ''}`}>
                                <div className="card-header bg-body-tertiary d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">Profile Information</h3>
                                    <button className="btn btn-outline-primary btn-sm" onClick={handleUpdateProfileClick}>
                                        <Edit className="me-1" size={16} /> Edit Profile
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-4">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random&size=100`} 
                                            alt="profile" 
                                            className="rounded-circle me-3" 
                                        />
                                        <div>
                                            <h4 className="mb-0">{`${profileData.firstName} ${profileData.lastName}`}</h4>
                                            <p className="text-muted mb-0">{profileData.department}</p>
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex align-items-center">
                                            <Mail className="me-3 text-primary" />
                                            <span>{profileData.email}</span>
                                        </li>
                                        <li className="list-group-item d-flex align-items-center">
                                            <Phone className="me-3 text-primary" />
                                            <span>{profileData.phone}</span>
                                        </li>
                                        <li className="list-group-item d-flex align-items-center">
                                            <UserCheck className="me-3 text-primary" />
                                            <span>ID: {profileData.id}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeTab === 'password' && (
                            <div className={`card shadow-sm ${theme === 'dark' ? 'text-bg-dark' : ''}`}>
                                <div className="card-header bg-body-tertiary">
                                    <h3 className="mb-0">Password Management</h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-3">
                                            <label className="form-label">Current Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><Lock /></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">New Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><Lock /></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirm New Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><Lock /></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Updating...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {activeTab === 'theme' && (
                            <div className={`card shadow-sm ${theme === 'dark' ? 'text-bg-dark' : ''}`}>
                                <div className="card-header bg-body-tertiary">
                                    <h3 className="mb-0">Theme Settings</h3>
                                </div>
                                <div className="card-body">
                                    <p>Select your preferred theme.</p>
                                    <div className="d-flex gap-3">
                                        <button 
                                            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                                            onClick={() => setTheme('light')}
                                        >
                                            <Sun className="me-2" /> Light
                                        </button>
                                        <button 
                                            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                                            onClick={() => setTheme('dark')}
                                        >
                                            <Moon className="me-2" /> Dark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
