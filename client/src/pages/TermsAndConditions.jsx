import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../shared/Footer';

const TermsAndConditions = () => (
    <>
        <NavBar />
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h2 className="mb-4 text-center">Terms and Conditions</h2>
                            <p>
                                These are the terms and conditions for using the <strong>TN Theervu Kaanal Grievance Redressal System</strong>. By registering or using this platform, you agree to abide by all rules, policies, and privacy practices as outlined here.
                            </p>
                            <ul className="mb-4">
                                <li>Your data will be used only for grievance redressal purposes and will not be shared with unauthorized parties.</li>
                                <li>You must provide accurate and truthful information during registration and grievance submission.</li>
                                <li>Abuse of the platform, submission of false grievances, or inappropriate conduct may result in account suspension.</li>
                                <li>For more details on data handling, see our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
                            </ul>
                            <p>
                                For any questions, contact the system administrator or refer to the official documentation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
);

export default TermsAndConditions; 