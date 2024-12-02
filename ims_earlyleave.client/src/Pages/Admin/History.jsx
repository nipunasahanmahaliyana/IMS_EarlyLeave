import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from "axios";
import { FaSignOutAlt } from 'react-icons/fa';
import logoImage from "/src/assets/logo.png";
import {
   
    UsergroupAddOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
  
} from '@ant-design/icons'; // Ant Design icons
const username = sessionStorage.getItem('Service_ID');

const RequestHistory = () => {

    const [requests,setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const historyRef = useRef();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const [showPopup, setShowPopup] = useState(false);


    const handleLogoutClick = () => {
        setShowPopup(true); // Show the popup
    };

    const getLeaveData = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`https://localhost:7247/ReqBySupervisor?supID=19559`);
            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setRequests(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getLeaveDataByTraineeID = async (term) => {
        try {
            setLoading(true);
            const response = await axios.post(`https://localhost:7247/ReqBySupervisorandTrainee?supID=19559&trainee_id=${term}`);
            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setRequests(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        gsap.fromTo(historyRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
        getLeaveData();
    }, []);



   

    const handleRowClick = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="flex flex-column">
        <nav className="bg-gradient-to-r from-blue-900 to-purple-800 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                <div className="container mx-auto flex items-center justify-between p-4 ">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full mr-3 transition-transform transform hover:scale-110" />
                        <a href="/AdminDashboard" className="text-3xl font-extrabold tracking-wide hover:text-blue-300 transition duration-300">
                            Early Leave
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/ManageUsers" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <UsergroupAddOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Manage Users</span>
                        </a>
                        <a href="/Report" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <FileTextOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Reports</span>
                        </a>
                        <a href="/History" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <HistoryOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">History</span>
                        </a>
                        <a href="/Approve" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <CheckCircleOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Approve</span>
                        </a>

                    </div>

                    {/* Avatar and Notifications */}
                    <div className="relative flex items-center">
                        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
                            <span className="text-white font-semibold">Menu</span>
                        </button>
                        <div className="hidden md:flex flex-row mr-4 items-center space-x-2">
                            <a href="/Profile" className="flex items-center hover:text-blue-300 transition duration-300">
                                <img
                                    id="avatarImage"
                                    src="data:image/jpeg;base64,@Model.imageBase64"
                                    className="w-10 h-10 rounded-full object-cover hover:scale-110 transition-transform duration-200"
                                />
                                <span className="ml-2 text-sm font-semibold">{username}</span>
                            </a>
                        </div>


                        <button className="cursor-pointer text-white hover:text-yellow-400 transition duration-300 flex items-center mr-4" onClick={handleLogoutClick}>
                            <FaSignOutAlt className="h-5 w-5 ml-2 mr-2" />
                        </button>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white text-black shadow-lg transition-all duration-300 ease-in-out">
                        <div className="flex flex-col p-4">
                            <a href="/AddRequest" className="py-2 hover:bg-gray-200 transition-colors duration-200">Request Leave</a>
                            <a href="/Requests" className="py-2 hover:bg-gray-200 transition-colors duration-200">Leave History</a>
                            <a href="/Profile" className="py-2 hover:bg-gray-200 transition-colors duration-200">Profile</a>
                            <a href="/Notification" className="py-2 hover:bg-gray-200 transition-colors duration-200">Notifications</a>
                            <a href="/Download" className="py-2 hover:bg-gray-200 transition-colors duration-200">Permissions</a>
                            <a href="/Approve" className="py-2 hover:bg-gray-200 transition-colors duration-200">Approval</a>
                            <div className="mt-4">
                                <button className="w-full text-left py-2 hover:bg-gray-200 transition-colors duration-200" onClick={handleLogoutClick}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </nav>
        
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-8 p-8 mt-[10vh]">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 text-white">Leave Request History</h1>
            {/* Search Bar */}
            <div className="mb-8 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search by Trainee ID...."
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);

                        if (value === '') {
                            // If the value is empty, call the method to get all leave data
                            getLeaveData();
                        } else {
                            // If there is a value, call the method to get data by Trainee ID
                            getLeaveDataByTraineeID(value);
                        }
                    }}

                />
            </div>
            <div ref={historyRef} className="overflow-hidden rounded-lg shadow-lg bg-white w-full max-w-[200vh]">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                                <tr className="bg-gradient-to-r from-green-400 to-blue-600 text-white">
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Trainee ID</th>
                                    <th className="p-4 text-left">Trainee Name</th>
                                    <th className="p-4 text-left">NIC</th>
                                    <th className="p-4 text-left">Date</th>
                                    <th className="p-4 text-left">Time</th>
                                    <th className="p-4 text-left">Reason</th>
                                    <th className="p-4 text-left">Supervisor ID</th>
                                    <th className="p-4 text-left">Leave Type</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Accepted DateTime</th>
                                    
                            </tr>
                        </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-100 transition duration-200 cursor-pointer" onClick={() => handleRowClick(request)}>
                                        <td className="p-4 border-b text-black">{request.id}</td>
                                        <td className="p-4 border-b text-black">{request.trainee_ID}</td>
                                        <td className="p-4 border-b text-black">{request.name}</td>
                                        <td className="p-4 border-b text-black">{request.nic}</td>
                                        <td className="p-4 border-b text-black">{request.date}</td>
                                        <td className="p-4 border-b text-black">{request.time}</td>
                                        <td className="p-4 border-b text-black">{request.reason}</td>
                                        <td className="p-4 border-b text-black">{request.supervisor_ID}</td>
                                        <td className="p-4 border-b text-black">{request.leave_type}</td>
                                        
                                        <td className="p-4 border-b text-black">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white ${request.status === 1
                                                        ? 'bg-green-500' // Approved
                                                        : request.status === 2
                                                        ? 'bg-red-500' // Rejected
                                                        : ' bg-yellow-500' // Pending (or other statuses)
                                                    }`}
                                            >
                                                {request.status === 1
                                                    ? 'Approved'
                                                    : request.status === 2
                                                        ? ' Rejected'
                                                        : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b text-black">{request.acceptDateTime}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">No requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-2">Leave Request Details</h2>
                        <p><strong>Leave ID:</strong> {selectedRequest.id}</p>
                        <p><strong>Trainee ID:</strong> {selectedRequest.trainee_ID}</p>
                        <p><strong>Trainee Name:</strong> {selectedRequest.name}</p>
                        <p><strong>Trainee NIC:</strong> {selectedRequest.nic}</p>
                        <p><strong>Leave Date:</strong> {selectedRequest.date}</p>
                        <p><strong>Leave Time:</strong> {selectedRequest.time}</p>
                        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                        <p><strong>Supervisor ID:</strong> {selectedRequest.supervisor_ID}</p>
                        <p><strong>Leave Type:</strong> {selectedRequest.leave_type}</p>
                        <p>
                            <span
                                className={`px-2 py-1 rounded-full text-white ${selectedRequest.status === 1
                                    ? 'bg-green-500' // Approved
                                    : selectedRequest.status === 2
                                        ? 'bg-red-500' // Rejected
                                        : ' bg-yellow-500' // Pending (or other statuses)
                                    }`}
                            >
                                {selectedRequest.status === 1
                                    ? 'Approved'
                                    : selectedRequest.status === 2
                                        ? ' Rejected'
                                        : 'Pending'}
                            </span>
                        </p>

                        <button onClick={handleCloseDetails} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Close</button>
                    </div>
                </div>
            )}
            </div>
            </div>
    );
};

export default RequestHistory;
