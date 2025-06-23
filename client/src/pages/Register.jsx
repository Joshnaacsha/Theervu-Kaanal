import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../shared/Footer';
import NavBar from '../components/NavBar';
import { User, FileText, Shield } from 'lucide-react';  // Importing icons from lucide-react

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (userType) => {
    switch (userType) {
      case 'petitioner':
        navigate('/register/petitioner');
        break;
      case 'official':
        navigate('/register/official');
        break;
      case 'admin':
        navigate('/register/admin');
        break;
      default:
        alert(`Registration as ${userType} would happen here`);
        navigate('/login');
    }
  };

  return (
    <>
      <div>
        <NavBar />
        <div className="container py-5">
          <h2 className="text-center text-dark">Grievance Redressal System</h2>
          <h4 className="text-center text-secondary">Select your registration type</h4>
          <div className="row justify-content-center mt-4">
            {/* Petitioner */}
            <div className="col-12 col-sm-6 col-md-3 text-center mb-4 mb-md-0">
              <div className="card p-3 shadow h-100">
                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-primary d-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px' }}>
                    <User size={30} className="text-white" />
                  </div>
                </div>
                <h5 className="mt-2 text-dark">Petitioner</h5>
                <p className="text-muted">Register as Petitioner</p>
                <button className="btn btn-primary w-100" onClick={() => handleRegister('petitioner')}>
                  Register as Petitioner
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
                <h5 className="mt-2 text-dark">Officials</h5>
                <p className="text-muted">Register as a department official</p>
                <button className="btn btn-success w-100" onClick={() => handleRegister('official')}>
                  Register as Official
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
                <h5 className="mt-2 text-dark">Admin</h5>
                <p className="text-muted">Register as admin</p>
                <button className="btn btn-danger w-100" onClick={() => handleRegister('admin')}>
                  Register as Admin
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-dark">
              Already have an account? <Link to="/login" className="text-primary">Login here</Link>
            </p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "50px", backgroundColor: "#212529", color: "white", padding: "20px 0" }}>
        <Footer />
      </div>
    </>
  );
};

export default Register;