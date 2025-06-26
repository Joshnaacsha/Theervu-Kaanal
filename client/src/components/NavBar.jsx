import React, { useState } from 'react';
import { Bell, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import shield from '../assets/shield.png';
import UserInfo from './UserInfo';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Dropdown } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';

    switch (user.role?.toLowerCase()) {
      case 'admin':
        return '/admin/dashboard';
      case 'official':
        switch (user.department?.toLowerCase()) {
          case 'rto':
            return '/official-dashboard/rto';
          case 'water':
            return '/official-dashboard/water';
          case 'electricity':
            return '/official-dashboard/electricity';
          default:
            return '/official-dashboard';
        }
      case 'petitioner':
        return '/petitioner/dashboard';
      default:
        return '/';
    }
  };

  const getSettingsPath = () => {
    if (!user) return '/settings';
    switch (user.role?.toLowerCase()) {
      case 'admin':
        return '/admin/settings';
      case 'official':
        switch (user.department?.toLowerCase()) {
          case 'rto':
            return '/official-dashboard/rto/settings';
          case 'water':
            return '/official-dashboard/water/settings';
          case 'electricity':
            return '/official-dashboard/electricity/settings';
          default:
            return '/official/settings';
        }
      case 'petitioner':
        return '/petitioner/settings';
      default:
        return '/settings';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Logo and Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={shield} alt="Logo" className="me-2" style={{ height: '30px' }} />
            <span className="d-none d-sm-inline">TN Theervu Kaanal</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop and Mobile Menu */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center ms-auto gap-3">
              {/* Notification Bell for logged-in users */}
              {user && (
                <div className="position-relative">
                  <NotificationBell userId={user.id} userRole={user.role} />
                </div>
              )}

              {/* User Menu */}
              {user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="transparent" className="text-white border-0 d-flex align-items-center gap-2">
                    <User size={20} />
                    <span className="d-none d-sm-inline">{user.firstName}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} to={getDashboardPath()}>
                      <User size={16} className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={getSettingsPath()}>
                      <Settings size={16} className="me-2" />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-light">Login</Link>
                  <Link to="/register" className="btn btn-light">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
