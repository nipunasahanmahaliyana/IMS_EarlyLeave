import React, { useEffect, useRef,useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../assets/Home.png";
import LogoutPopup from '../../Pages/LogOut';
import logoImage from "/src/assets/logo.png";
import { FaSignOutAlt } from 'react-icons/fa';
import {
    UsergroupAddOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons'; // Ant Design icons


const username = sessionStorage.getItem('Service_ID') || "Guest"; // Fallback for missing username


function LeaveRequests() {

    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogoutClick = () => {
        setShowPopup(true); // Show the popup
    };

    const handleLogout = () => {
        // Remove the session variable
        sessionStorage.removeItem('username');
        // Navigate to the login page
        navigate('/');
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Hide the popup
    };

   
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    
    const [requests, setRequests] = useState([]);

    useEffect(() => {
    
        const fetchRequets = async () => {
            try {
                const response = await axios.get("https://imsearlyleaveserver.azurewebsites.net/PendingRequests");
                setRequests(response.data);
            } catch (error) {
                console.print("");
            }
        };

        fetchRequets();

    }, []);

    const LeaveRequestCard = ({ id, name, trainee_id, nic, reason, supervisor, leave_type ,date,time}) => {
      
        const cardRef = useRef(null);
        const statusIndicatorRef = useRef(null);
        const confirmationOverlayRef = useRef(null);
        const confirmationOverlayRefNo = useRef(null);

        const createNotification = async (description, traineeId) => {
            // Validate input parameters
            if (!description || traineeId <= 0) {
                console.error("Validation Error: Invalid input parameters.");
                return { success: false, message: "Invalid input parameters." };
            }

            try {
                const response = await axios.post(`https://imsearlyleaveserver.azurewebsites.net/SaveNotification?description=${description}&trainee_id=${traineeId}`);


                // Check if the response indicates success
                if (response.status === 200) {
                    console.log("Notification created successfully:", response.data);
                    return { success: true, message: response.data.message };
                } else {
                    console.error("Error creating notification:", response.data);
                    return { success: false, message: "Failed to create notification." };
                }
            } catch (error) {
                // Handle errors
                if (axios.isAxiosError(error)) {
                    // Handle Axios specific errors
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        console.error("Server Error:", error.response.data);
                        return { success: false, message: error.response.data.message || "Server error occurred." };
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.error("Network Error: No response received");
                        return { success: false, message: "Network error: No response from server." };
                    }
                } else {
                    // Handle other errors
                    console.error("Error:", error.message);
                    return { success: false, message: "An unexpected error occurred." };
                }
            }
        };

        const handleRequestAction = (action, id) => {
            const card = cardRef.current;
            const statusIndicator = statusIndicatorRef.current;
            const confirmationOverlay = confirmationOverlayRef.current;
            const confirmationOverlayNo = confirmationOverlayRefNo.current;

            if (action === 'approve') {

                try {
                    // Assuming `id` is defined and holds the request ID
                    console.log(id);

                    axios.put(`https://imsearlyleaveserver.azurewebsites.net/SupervisorApproval?id=${id}`)
                        .then(response => {
                            // Handle success
                            console.log("Success:", response.data);

                            // 1. Status Update Animation
                            gsap.to(statusIndicator, { backgroundColor: '#212226', color: '#FAFDFC', duration: 0.3 });
                            statusIndicator.textContent = 'Approved';

                            gsap.set(`#acceptButton-${id}`, { display: 'none' });

                            gsap.set(`#rejectButton-${id}`, { display: 'none' });

                            // 2. Confirmation Animation
                            gsap.to(confirmationOverlay, { opacity: 1, duration: 0.3 });
                            gsap.to(confirmationOverlay, { opacity: 0, duration: 0.3, delay: 1 });

                            //alert("Done");
                            gsap.to(card, { backgroundColor: '#3AADA8', delay: 2, ease: 'power2.in', })

                            alert("Request approved successfully!");

                            const edit = date;
                            const dateOnly = edit.split("T")[0]; // "2024-10-31"
                            const desc = (`Your ${leave_type} leave request for ${dateOnly} | ${time} was `);
                            
                            try {
                                const response = axios.post(`https://imsearlyleaveserver.azurewebsites.net/AddRecentActivity?trainee_id=${trainee_id}&description=${desc}&status=${1}`);
                                console.log('Leave request added successfully:', response.data);
                            } catch (error) {
                                console.error('Error adding leave request:', error.response ? error.response.data : error.message);

                            }

                        })
                        .catch(error => {
                            // Handle error
                            if (error.response) {
                                // Server responded with a status other than 200 range
                                console.error('Error Response:', error.response.data); // Log detailed error response
                                alert(error.response.data.message || 'Something went wrong with the request.');
                            } else if (error.request) {
                                // The request was made but no response was received
                                console.error('Error Request:', error.request);
                                alert('No response received from the server. Please try again.');
                            } else {
                                // Something happened in setting up the request that triggered an error
                                console.error('Error Message:', error.message);
                                alert('An unexpected error occurred: ' + error.message);
                            }
                        })

                    const details = `Your Leave Request (${id}) Approved , You can download it`;

                    const result = createNotification(details, trainee_id);

                    if (result.success) {
                        console.log(result.message);
                    } else {
                        console.error(result.message);
                    }

                } catch (error) {
                    alert("Error");
                }

                // 3. Card Removal (with shrink animation) after a delay
                //gsap.to(card, { height: 0, duration: 0.5, ease: 'power2.inOut', delay: 3, onComplete: () => card.remove() });
            } else if (action === 'reject') {
                try { 
                    // Assuming `id` is defined and holds the request ID
                    console.log(id);

                    axios.put(`https://imsearlyleaveserver.azurewebsites.net/SupervisorDecline?id=${id}`)
                        .then(response => {
                            // Handle success
                            console.log("Success:", response.data);
                            // 1. Status Update Animation
                            gsap.to(statusIndicator, { backgroundColor: '#212226', color: '#FAFDFC', duration: 0.3 });
                            statusIndicator.textContent = 'Rejected';
                            statusIndicator.classList.add('bg-red-100', 'text-red-800');
                            statusIndicator.classList.remove('bg-yellow-100', 'text-yellow-800');


                            gsap.set(`#acceptButton-${id}`, { display: 'none' });

                            gsap.set(`#rejectButton-${id}`, { display: 'none' });

                            // 2. Confirmation Animation
                            gsap.to(confirmationOverlayNo, { opacity: 1, duration: 0.3 });
                            gsap.to(confirmationOverlayNo, { opacity: 0, duration: 0.3, delay: 1 });

                            //alert("Done");
                            gsap.to(card, { backgroundColor: '#F54768', delay: 2, ease: 'power2.in' })

                            alert("Request declined!");

                            const edit = date;
                            const dateOnly = edit.split("T")[0]; // "2024-10-31"
                            const desc = (`Your ${leave_type} leave request for ${dateOnly} | ${time} was `);

                            try {
                                const response = axios.post(`https://imsearlyleaveserver.azurewebsites.net/AddRecentActivity?trainee_id=${trainee_id}&description=${desc}&status=${2}`);
                                console.log('Leave request added successfully:', response.data);
                            } catch (error) {
                                console.error('Error adding leave request:', error.response ? error.response.data : error.message);

                            }

                            const details = `Your Leave Request (${id}) was declined`;

                            const result = createNotification(details, trainee_id);

                            if (result.success) {
                                console.log(result.message);
                            } else {
                                console.error(result.message);
                            }

                        })
                        .catch(error => {
                            // Handle error
                            if (error.response) {
                                // Server responded with a status other than 200 range
                                console.error('Error Response:', error.response.data); // Log detailed error response
                                alert(error.response.data.message || 'Something went wrong with the request.');
                            } else if (error.request) {
                                // The request was made but no response was received
                                console.error('Error Request:', error.request);
                                alert('No response received from the server. Please try again.');
                            } else {
                                // Something happened in setting up the request that triggered an error
                                console.error('Error Message:', error.message);
                                alert('An unexpected error occurred: ' + error.message);
                            }
                        })
                        
                } catch (error) {
                    alert("Error");
                }

                // 2. Fade Out Animation (Simple and effective)
                //gsap.to(card, { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 3, onComplete: () => card.remove() });
            }
        }
        
        return (
            <div ref={cardRef} className="request-card bg-green-900  rounded-lg shadow-md p-6 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div >
                        <p className="text-lg font-medium text-white">Request ID: {id}</p>
                        <p className="text-lg font-medium text-white">Name: {name}</p>
                        <p className="text-lg font-medium text-white">Trainee ID: {trainee_id}</p>
                        <p className="text-lg font-medium text-white">NIC Number: {nic}</p>
                        <p className="text-lg font-medium text-white">Supervisor ID: {supervisor}</p>
                        <p className="text-lg font-medium text-white">Reason: {reason}</p>
                        <p className="text-lg font-medium text-white">Leave Type: {leave_type}</p>
                        <p className="text-lg font-medium text-white">Date: {date}</p>
                        <p className="text-lg font-medium text-white">Date: {time}</p>
                    </div>
                    <span
                        ref={statusIndicatorRef}
                        className="status-indicator px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 transition-colors duration-300"
                    >
                        Pending
                    </span>
                </div>


                <div className="flex justify-end space-x-4">
                    <button
                        id={`rejectButton-${id}`}
                        onClick={() => handleRequestAction('reject', id)}
                        className="reject-button px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Reject
                    </button>
                    <button
                        id={`acceptButton-${id}`}
                        onClick={() => handleRequestAction('approve', id)}
                        className="approve-button relative px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 group"
                    >
                        Approve
              
                    </button>
                </div>
                <div
                    ref={confirmationOverlayRef}
                    className="confirmation-overlay absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 text-white text-lg font-medium px-4 py-2 rounded-md opacity-0 pointer-events-none transition duration-300"
                >
                    Approved!
                </div>
                <div
                    ref={confirmationOverlayRefNo}
                    className="confirmation-overlay absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 text-white text-lg font-medium px-4 py-2 rounded-md opacity-0 pointer-events-none transition duration-300"
                >
                    Rejected!
                </div>
            </div>
        );
    };


    if (requests.length === 0) {
        return (
            <div className="font-sans w-full h-full">
                <nav className="bg-gradient-to-r from-blue-900 to-purple-800 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                    <div className="container mx-auto flex items-center justify-between p-4">
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
                <div className="flex justify-center">
                 
                    <div className=" p-32 h-[100vh] w-full rounded-md" style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        <div className="rounded-lg shadow-md p-6 w-[150vh]">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Leave Requests - Awaiting Approval</h2>
                            <div className="h-20 w-90  text-center py-20 ">
                                <h1 className="text-gray-500 text-2xl">No requests available.</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
       
        <div className="font-sans w-full h-[100vh]">
            <nav className="bg-gradient-to-r from-blue-900 to-purple-800 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                <div className="container mx-auto flex items-center justify-between p-4">
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
           <div className="flex flex-row justify-center">
                
                <div className="flex-1 bg-gray-100 h-[100vh] w-full rounded-md flex justify-center" style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',

                }}>
                    <div className=" w-full rounded-lg shadow-md p-20 mt-[10vh] w-full overflow-x-hidden overflow-y-scroll bg-gradient-to-r from-green-400 to-blue-500 p-8 ">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Leave Requests - Awaiting Approval</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-9 ">
                        {requests.map((request) => (
                            <LeaveRequestCard
                                key={request.id}
                                id={request.id}
                                name={request.name}
                                trainee_id={request.trainee_ID}
                                nic={request.nic}
                                reason={request.reason}
                                supervisor={request.supervisor_ID}
                                leave_type={request.leave_type}
                                date={request.date}
                                time={request.time}
                            />
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default LeaveRequests;
