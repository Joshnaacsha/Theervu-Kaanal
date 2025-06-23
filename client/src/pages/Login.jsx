import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../shared/Footer';
import NavBar from '../components/NavBar';
import { User, FileText, Shield } from 'lucide-react';  // Import icons

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (userType) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', 'Mark Edward');
    localStorage.setItem('userRole', 'Official');
    navigate('/');
  };

  return (
    <>
      <div>
        <NavBar />
        <div className="container py-5">
          <h2 className="text-center">Grievance Redressal System</h2>
          <h4 className="text-center text-secondary">Select your login type</h4>

          <div className="row justify-content-center mt-4">
            {/* Petitioner */}
            <div className="col-12 col-sm-6 col-md-3 text-center mb-4 mb-md-0">
              <div className="card p-3 shadow h-100">
                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-primary d-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px' }}>
                    <User size={30} className="text-white" />
                  </div>
                </div>
                <h5 className="mt-2">Petitioner</h5>
                <p>Login as Petitioner</p>
                <button className="btn btn-primary w-100" onClick={() => navigate('/login/petitioner')}>
                  Login as Petitioner
                </button>
              </div>
            </div>

            {/* Officials */}
            <div className="col-12 col-sm-6 col-md-3 text-center mb-4 mb-md-0">
              <div className="card p-3 shadow h-100">
                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-success d-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px' }}>
                    <FileText size={30} className="text-white" />
                  </div>
                </div>
                <h5 className="mt-2">Officials</h5>
                <p>Login as a department official</p>
                <button className="btn btn-success w-100" onClick={() => navigate('/login/official')}>
                  Login as Official
                </button>
              </div>
            </div>

            {/* Master Controller */}
            <div className="col-12 col-sm-12 col-md-3 text-center">
              <div className="card p-3 shadow h-100">
                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-danger d-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px' }}>
                    <Shield size={30} className="text-white" />
                  </div>
                </div>
                <h5 className="mt-2">Master Controller</h5>
                <p>Login as system administrator</p>
                <button className="btn btn-danger w-100" onClick={() => navigate('/login/admin')}>
                  Login as Master
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p>
              Don't have an account? <Link to="/register" className="text-primary">Register here</Link>
            </p>
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
};

export default Login;
