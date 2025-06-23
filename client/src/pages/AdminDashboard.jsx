import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../shared/Footer";
import NavBar from "../components/NavBar";
import AdminSidebar from '../components/AdminSidebar';
import SmartQueryChatbot from '../components/SmartQueryChatbot';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { Container, Row, Col, Card, Button, Table, Modal, Form } from "react-bootstrap";
import { Bell, User, ChevronDown, Plus, MessageSquare, List, X, Database, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL } from '../config';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [resourceData, setResourceData] = useState([]);
    const [resourceLoading, setResourceLoading] = useState(true);
    const [resourceError, setResourceError] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        // Set initial activeTab based on current path
        if (location.pathname === '/admin/escalated') return 'escalated';
        if (location.pathname === '/admin/resource-management') return 'resource';
        if (location.pathname === '/admin/settings') return 'settings';
        if (location.pathname === '/admin/smart-query') return 'smart-query';
        return 'dashboard';
    });
    const [escalatedGrievances, setEscalatedGrievances] = useState([]);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [escalationResponse, setEscalationResponse] = useState('');
    const [newAssignedTo, setNewAssignedTo] = useState('');
    const [officials, setOfficials] = useState([]);
    const [escalatedLoading, setEscalatedLoading] = useState(false);
    const [escalatedError, setEscalatedError] = useState(null);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState(null);
    const [quickStats, setQuickStats] = useState({
        totalCases: { value: 0, trend: '0%' },
        activeCases: { value: 0, trend: '0%' },
        resolvedCases: { value: 0, trend: '0%' },
        departments: { value: 0, trend: 'Stable' }
    });

    useEffect(() => {
        // Update activeTab when route changes
        if (location.pathname === '/admin/escalated') setActiveTab('escalated');
        else if (location.pathname === '/admin/resource-management') setActiveTab('resource');
        else if (location.pathname === '/admin/settings') setActiveTab('settings');
        else if (location.pathname === '/admin/smart-query') setActiveTab('smart-query');
        else if (location.pathname === '/admin/dashboard') setActiveTab('dashboard');
    }, [location.pathname]);

    useEffect(() => {
        console.log('Active tab changed to:', activeTab);

        // Check if user is authenticated before making API calls
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            console.log('No token or user found, redirecting to login');
            navigate('/login');
            return;
        }

        if (activeTab === 'dashboard') {
            fetchResourceData();
            fetchDashboardStats();
            fetchQuickStats();
        } else if (activeTab === 'escalated') {
            fetchEscalatedGrievances();
            fetchOfficials();
        }
    }, [activeTab]);

    const fetchResourceData = async () => {
        try {
            setResourceLoading(true);
            setResourceError(null);

            const response = await api.get('/admin/resource-management');
            setResourceData(response.data.resources);
        } catch (error) {
            console.error('Error fetching resource data:', error);
            setResourceError('Failed to load resource data');
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                // Clear any stale data
                setResourceData([]);
                navigate('/login');
            }
        } finally {
            setResourceLoading(false);
        }
    };

    const fetchEscalatedGrievances = async () => {
        try {
            setEscalatedLoading(true);
            setEscalatedError(null);

            const response = await api.get('/grievances/escalated');
            setEscalatedGrievances(response.data.grievances);
        } catch (error) {
            console.error('Error fetching escalated grievances:', error);
            setEscalatedError(error.message);
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                navigate('/login');
            }
        } finally {
            setEscalatedLoading(false);
        }
    };

    const fetchOfficials = async (department) => {
        try {
            const response = await api.get(`/admin/officials?department=${department}`);
            setOfficials(response.data.officials.filter(official => official.department === department));
        } catch (error) {
            console.error('Error fetching officials:', error);
            toast.error('Failed to load officials');
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                navigate('/login');
            }
        }
    };

    const handleOpenResponseModal = (grievance) => {
        setSelectedGrievance(grievance);
        // Fetch officials specific to the grievance department
        fetchOfficials(grievance.department);
        setShowResponseModal(true);
    };

    const fetchDashboardStats = async () => {
        try {
            setDashboardLoading(true);
            setDashboardError(null);

            // Fetch department performance data
            const deptResponse = await api.get('/admin/department-stats');
            setDepartmentStats(deptResponse.data.departmentStats);

            // Fetch monthly trends data
            const monthlyResponse = await api.get('/admin/monthly-stats');
            setMonthlyStats(monthlyResponse.data.monthlyStats);

        } catch (error) {
            console.error('Error fetching dashboard statistics:', error);
            setDashboardError('Failed to load dashboard statistics');
            toast.error('Failed to load dashboard statistics');
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                // Clear any stale data
                setDepartmentStats([]);
                setMonthlyStats([]);
                navigate('/login');
            }
        } finally {
            setDashboardLoading(false);
        }
    };

    const fetchQuickStats = async () => {
        try {
            const response = await api.get('/admin/quick-stats');
            setQuickStats(response.data);
        } catch (error) {
            console.error('Error fetching quick statistics:', error);
            toast.error('Failed to load quick statistics');
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                // Reset quick stats to default values
                setQuickStats({
                    totalCases: { value: 0, trend: '0%' },
                    activeCases: { value: 0, trend: '0%' },
                    resolvedCases: { value: 0, trend: '0%' },
                    departments: { value: 0, trend: 'Stable' }
                });
                navigate('/login');
            }
        }
    };

    const handleRespondToEscalation = async () => {
        try {
            // Validate response
            if (!escalationResponse?.trim()) {
                toast.error('Please provide a response to the escalation');
                return;
            }

            if (!selectedGrievance?._id) {
                toast.error('Invalid grievance selected');
                return;
            }

            const isReassignment = !!newAssignedTo;
            const payload = {
                escalationResponse: escalationResponse.trim(),
                isReassignment,
                newAssignedTo: newAssignedTo || undefined
            };

            await api.post(`/grievances/${selectedGrievance._id}/escalation-response`, payload);

            toast.success('Response submitted successfully');
            setShowResponseModal(false);
            setEscalationResponse('');
            setNewAssignedTo('');
            fetchEscalatedGrievances();
        } catch (error) {
            console.error('Error responding to escalation:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to submit response');
            if (error.message === 'AUTH_REQUIRED' || error.isAuthError) {
                navigate('/login');
            }
        }
    };

    const handleTabChange = (tab) => {
        console.log('Changing tab to:', tab);
        setActiveTab(tab);
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'danger';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return 'success';
            case 'in-progress':
                return 'primary';
            case 'assigned':
                return 'info';
            case 'pending':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const renderDashboardCharts = () => (
        <Row className="mb-4">
            <Col md={6}>
                <Card className="p-3 shadow-sm">
                    <h6>Department Performance</h6>
                    {dashboardLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : dashboardError ? (
                        <div className="alert alert-danger">{dashboardError}</div>
                    ) : (
                        <BarChart
                            width={500}
                            height={300}
                            data={departmentStats}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="department" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="resolved" fill="#28a745" name="Resolved" barSize={50} />
                            <Bar dataKey="pending" fill="#ffc107" name="Pending" barSize={50} />
                            <Bar dataKey="inProgress" fill="#17a2b8" name="In Progress" barSize={50} />
                        </BarChart>
                    )}
                </Card>
            </Col>
            <Col md={6}>
                <Card className="p-3 shadow-sm">
                    <h6>Monthly Trends</h6>
                    {dashboardLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : dashboardError ? (
                        <div className="alert alert-danger">{dashboardError}</div>
                    ) : (
                        <LineChart width={400} height={250} data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#007bff" name="Total Cases" />
                            <Line type="monotone" dataKey="resolved" stroke="#28a745" name="Resolved Cases" />
                        </LineChart>
                    )}
                </Card>
            </Col>
        </Row>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <Row className="mb-4">
                            <Col>
                                <h2>Admin Dashboard</h2>
                                <p className="text-muted">Welcome to the admin dashboard</p>
                            </Col>
                        </Row>

                        {/* Top Navbar */}
                        <div className="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm mb-3">
                            <h4>Dashboard</h4>
                            <div className="d-flex align-items-center">
                                <Button variant="light" className="me-3 position-relative">
                                    <Bell size={20} />
                                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">3</span>
                                </Button>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary text-white p-2 me-2">A</div>
                                    <span>Admin</span>
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <Row className="mb-4">
                            <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
                                <Card className="p-3 shadow-sm h-100">
                                    <h6 className="text-muted">Total Cases</h6>
                                    <h4>{quickStats.totalCases.value}</h4>
                                    <span className={`text-${quickStats.totalCases.trend.includes("+") ? "success" : "muted"}`}>
                                        {quickStats.totalCases.trend}
                                    </span>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
                                <Card className="p-3 shadow-sm h-100">
                                    <h6 className="text-muted">Active Cases</h6>
                                    <h4>{quickStats.activeCases.value}</h4>
                                    <span className={`text-${quickStats.activeCases.trend.includes("+") ? "warning" : "muted"}`}>
                                        {quickStats.activeCases.trend}
                                    </span>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
                                <Card className="p-3 shadow-sm h-100">
                                    <h6 className="text-muted">Cases Resolved</h6>
                                    <h4>{quickStats.resolvedCases.value}</h4>
                                    <span className={`text-${quickStats.resolvedCases.trend.includes("+") ? "success" : "muted"}`}>
                                        {quickStats.resolvedCases.trend}
                                    </span>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <Card className="p-3 shadow-sm h-100">
                                    <h6 className="text-muted">Departments</h6>
                                    <h4>{quickStats.departments.value}</h4>
                                    <span className="text-muted">{quickStats.departments.trend}</span>
                                </Card>
                            </Col>
                        </Row>

                        {/* Charts */}
                        {renderDashboardCharts()}

                        {/* Resource Management Section */}
                        <Card className="shadow-sm mt-4">
                            <Card.Header>
                                <h6>Department Resource Management</h6>
                            </Card.Header>
                            <Card.Body>
                                {resourceLoading ? (
                                    <div className="text-center">Loading resource data...</div>
                                ) : resourceError ? (
                                    <div className="text-danger">{resourceError}</div>
                                ) : (
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Department</th>
                                                <th>Grievance ID</th>
                                                <th>Taluk</th>
                                                <th>Division</th>
                                                <th>District</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Requirements</th>
                                                <th>Funds Required</th>
                                                <th>Resources</th>
                                                <th>Manpower</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resourceData.map((resource) => (
                                                <tr key={resource._id}>
                                                    <td>{resource.department}</td>
                                                    <td>{resource.petitionId}</td>
                                                    <td>{resource.taluk || 'N/A'}</td>
                                                    <td>{resource.division || 'N/A'}</td>
                                                    <td>{resource.district || 'N/A'}</td>
                                                    <td>{new Date(resource.startDate).toLocaleDateString()}</td>
                                                    <td>{new Date(resource.endDate).toLocaleDateString()}</td>
                                                    <td>{resource.requirementsNeeded}</td>
                                                    <td>₹{resource.fundsRequired.toLocaleString()}</td>
                                                    <td>{resource.resourcesRequired}</td>
                                                    <td>{resource.manpowerNeeded}</td>
                                                    <td>
                                                        <span className={`badge bg-${getStatusBadgeClass(resource.status)}`}>
                                                            {resource.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </>
                );
            case 'escalated':
                return (
                    <Card className="shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Escalated Grievances</h6>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={fetchEscalatedGrievances}
                                disabled={escalatedLoading}
                            >
                                {escalatedLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </>
                                ) : (
                                    <>Refresh</>
                                )}
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {escalatedError ? (
                                <div className="alert alert-danger" role="alert">
                                    <AlertTriangle size={18} className="me-2" />
                                    {escalatedError}
                                </div>
                            ) : escalatedLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : escalatedGrievances.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    No escalated grievances found
                                </div>
                            ) : (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Grievance ID</th>
                                            <th>Title</th>
                                            <th>Department</th>
                                            <th>Taluk</th>
                                            <th>Division</th>
                                            <th>District</th>
                                            <th>Status</th>
                                            <th>Priority</th>
                                            <th>Assigned Official</th>
                                            <th>Created At</th>
                                            <th>Escalated At</th>
                                            <th>Days Since Escalation</th>
                                            <th>Escalation Reason</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {escalatedGrievances.map((grievance) => (
                                            <tr key={grievance._id}>
                                                <td>{grievance.petitionId || 'N/A'}</td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }} title={grievance.title}>
                                                        {grievance.title || 'No Title'}
                                                    </div>
                                                </td>
                                                <td>{grievance.department || 'Unassigned'}</td>
                                                <td>{grievance.taluk || 'N/A'}</td>
                                                <td>{grievance.division || 'N/A'}</td>
                                                <td>{grievance.district || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge bg-${getStatusBadgeClass(grievance.status)}`}>
                                                        {grievance.status ? grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1) : 'Unknown'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${getPriorityBadgeClass(grievance.priority)}`}>
                                                        {grievance.priority ? grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1).toLowerCase() : 'Not Set'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {grievance.assignedTo ?
                                                        `${grievance.assignedTo.firstName || ''} ${grievance.assignedTo.lastName || ''}`.trim() || 'Unnamed' :
                                                        'Unassigned'
                                                    }
                                                </td>
                                                <td>{grievance.createdAt ? new Date(grievance.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                <td>{grievance.escalatedAt ? new Date(grievance.escalatedAt).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    {grievance.escalatedAt ?
                                                        Math.floor((new Date() - new Date(grievance.escalatedAt)) / (1000 * 60 * 60 * 24)) :
                                                        'N/A'
                                                    }
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }} title={grievance.escalationReason}>
                                                        {grievance.escalationReason || 'No reason provided'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant={grievance.escalationResponse ? "success" : "primary"}
                                                        size="sm"
                                                        onClick={() => handleOpenResponseModal(grievance)}
                                                        disabled={grievance.escalationResponse}
                                                    >
                                                        {grievance.escalationResponse ? "Responded" : "Respond"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                );
            case 'resource':
                return (
                    <Container fluid>
                        <Row>
                            <Col>
                                <Card className="shadow-sm">
                                    <Card.Header>
                                        <h6>Resource Management</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        {resourceLoading ? (
                                            <div className="text-center">Loading resource data...</div>
                                        ) : resourceError ? (
                                            <div className="text-danger">{resourceError}</div>
                                        ) : (
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Department</th>
                                                        <th>Grievance ID</th>
                                                        <th>Requirements</th>
                                                        <th>Funds Required</th>
                                                        <th>Resources</th>
                                                        <th>Manpower</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {resourceData.map((resource) => (
                                                        <tr key={resource._id}>
                                                            <td>{resource.department}</td>
                                                            <td>{resource.petitionId}</td>
                                                            <td>{resource.requirementsNeeded}</td>
                                                            <td>₹{resource.fundsRequired.toLocaleString()}</td>
                                                            <td>{resource.resourcesRequired}</td>
                                                            <td>{resource.manpowerNeeded}</td>
                                                            <td>
                                                                <span className={`badge bg-${getStatusBadgeClass(resource.status)}`}>
                                                                    {resource.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                );
            case 'smart-query':
                return (
                    <Container fluid>
                        <Row>
                            <Col>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h4 className="mb-4">Smart Query Assistant</h4>
                                        <p className="text-muted mb-4">
                                            Ask questions about grievances, resources, and escalations in natural language
                                        </p>
                                        <SmartQueryChatbot />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                );
            default:
                return null;
        }
    };

    return (
        <div className="d-flex">
            <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="flex-grow-1">
                <NavBar />
                <Container fluid className="py-3">
                    {renderContent()}
                </Container>
            </div>

            {/* Response Modal */}
            <Modal
                show={showResponseModal}
                onHide={() => setShowResponseModal(false)}
                style={{ zIndex: 9999 }}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Respond to Escalation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedGrievance && (
                        <Form>
                            {/* Grievance Details Section */}
                            <div className="grievance-details mb-4 p-3 bg-light rounded">
                                <h6 className="border-bottom pb-2 mb-3">Grievance Details</h6>
                                <div className="mb-2">
                                    <strong>Grievance ID:</strong> {selectedGrievance.petitionId || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>Title:</strong> {selectedGrievance.title}
                                </div>
                                <div className="mb-2">
                                    <strong>Description:</strong>
                                    <p className="text-muted mb-2">{selectedGrievance.description}</p>
                                </div>
                                <div className="mb-2">
                                    <strong>Status:</strong>{' '}
                                    <span className={`badge bg-${getStatusBadgeClass(selectedGrievance.status)}`}>
                                        {selectedGrievance.status?.charAt(0).toUpperCase() + selectedGrievance.status?.slice(1)}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <strong>Priority:</strong>{' '}
                                    <span className={`badge bg-${getPriorityBadgeClass(selectedGrievance.priority)}`}>
                                        {selectedGrievance.priority}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <strong>Escalation Reason:</strong>
                                    <p className="text-muted mb-0">{selectedGrievance.escalationReason}</p>
                                </div>
                            </div>

                            {/* Response Form Section */}
                            <h6 className="border-bottom pb-2 mb-3">Response Details</h6>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGrievance.department}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Reassign to Official ({selectedGrievance.department} Department)</Form.Label>
                                <Form.Select
                                    value={newAssignedTo}
                                    onChange={(e) => setNewAssignedTo(e.target.value)}
                                    required
                                >
                                    <option value="">Select an official</option>
                                    {officials.map((official) => (
                                        <option key={official._id} value={official._id}>
                                            {official.firstName} {official.lastName} - {official.email}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Response</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={escalationResponse}
                                    onChange={(e) => setEscalationResponse(e.target.value)}
                                    placeholder="Enter your response to the escalation..."
                                    required
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRespondToEscalation}>
                        Submit Response
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
