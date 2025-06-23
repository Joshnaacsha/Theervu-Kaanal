import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../shared/Footer';

const PrivacyPolicy = () => (
    <>
        <NavBar />
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h2 className="mb-4 text-center">Privacy Policy</h2>
                            <p>
                                This Privacy Policy explains how <strong>TN Theervu Kaanal Grievance Redressal System</strong> collects, uses, and protects your personal information.
                            </p>
                            <ul className="mb-4">
                                <li>We collect only the information necessary for grievance redressal and communication.</li>
                                <li>Your data is stored securely and is not shared with unauthorized third parties.</li>
                                <li>You have the right to access, update, or request deletion of your personal data.</li>
                                <li>We use cookies and similar technologies only for session management and security.</li>
                                <li>For any privacy-related concerns, contact the system administrator.</li>
                            </ul>
                            <p>
                                By using this platform, you consent to the collection and use of your information as described in this policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
);

export default PrivacyPolicy; 