import React, { useEffect, useRef,useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/Home.png';
import LogoutPopup from '../Pages/LogOut';
import logoImage from '../assets/logo.png';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import {
    UserOutlined,
    BellOutlined,
    DownloadOutlined,
    LogoutOutlined, DashboardOutlined, FileAddOutlined, HistoryOutlined
} from '@ant-design/icons'; // Ant Design icons

const trainee_id = sessionStorage.getItem('Trainee ID') || "Guest"; // Fallback for missing username
function LeaveRequests() {

    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                const response = await axios.get("https://localhost:7247/PendingRequests");
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
                const response = await axios.post(`https://localhost:7247/SaveNotification?description=${description}&trainee_id=${traineeId}`);


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

                    axios.put(`https://localhost:7247/SupervisorApproval?id=${id}`)
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
                                const response = axios.post(`https://localhost:7247/AddRecentActivity?trainee_id=${trainee_id}&description=${desc}&status=${1}`);
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

                    axios.put(`https://localhost:7247/SupervisorDecline?id=${id}`)
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
                                const response = axios.post(`https://localhost:7247/AddRecentActivity?trainee_id=${trainee_id}&description=${desc}&status=${2}`);
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
            <div className="font-sans w-[196.5vh] h-[100vh]">
                <nav className="bg-gradient-to-r from-green-400 to-blue-600 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                    <div className="container mx-auto flex items-center justify-between p-4">
                        <div className="ml-[5vh]">
                            <a href="/Dashboard" className="text-white text-2xl font-bold">Early Leave</a>
                        </div>

                        <div className="flex items-center">
                            <ul className="md:flex text-white items-center">
                                <a href="/Profile">
                                    <li className="mr-6 flex items-center cursor-pointer hover:text-black transition duration-300">
                                        <img src={logoImage} className="w-[50px] h-[50px] rounded-full object-cover mr-2" alt="Profile" />
                                        <span>{trainee_id}</span>
                                    </li>
                                </a>
                                <li>
                                    <a className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center" onClick={handleLogoutClick}>
                                        <FaSignOutAlt className="h-5 w-5 mr-2" />
                                        <span className="mr-3">Logout</span>
                                    </a>
                                </li>
                                <li className="relative">
                                    <button
                                        className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center px-2"
                                        onClick={toggleDropdown}
                                    >
                                        <FaBell className="h-5 w-5 text-white mr-3" />

                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                                            <div className="p-2 border-b">
                                                <span className="font-bold">Notifications</span>
                                            </div>
                                            <ul>
                                                <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 1</li>
                                                <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 2</li>
                                                <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 3</li>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="flex flex-row">
                    <aside className="bg-gradient-to-b from-green-400 to-blue-600 text-white transition-all duration-300 ease-in-out shadow-2xl h-[100vh] px-8 py-20" style={{

                        position: 'sticky',
                        top: '0',

                    }}>
                        <img src={logoImage} className="w-[150px] absolute" alt="Logo" />

                        <nav>
                            <ul className="space-y-6 mb-6 py-20 mt-[9vh]">
                                <li>
                                    <a href="/Dashboard" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <DashboardOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/AddRequest" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <FileAddOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Request Leave</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Requests" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <HistoryOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Leave History</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Profile" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <UserOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Notifications" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <BellOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Notifications</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Download" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                        <DownloadOutlined className="h-6 w-6 mr-3" />
                                        <span className="font-medium">Permissions</span>
                                    </a>
                                </li>
                                <li>
                                    <div className="mt-auto">
                                        <a

                                            className="flex items-center px-6 py-3 cursor-pointer hover:bg-red-600 rounded-md transition-all duration-200 ease-in-out"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent default anchor click behavior
                                                handleLogoutClick(); // Call the function
                                            }}
                                        >
                                            <LogoutOutlined className="h-6 w-6 ml-2" />
                                            <span className="ml-3 nav-text text-lg font-medium text-white">Logout</span>
                                        </a>
                                    </div>
                                </li>
                            </ul>

                            <LogoutPopup
                                show={showPopup}
                                onClose={handleClosePopup}
                                onLogout={handleLogout}
                            />
                        </nav>
                    </aside>

                    <div className=" p-32 px-12 w-[166vh] rounded-md" style={{
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
       
        <div className="font-sans w-[196.5vh] h-[100vh]">
            <nav className="bg-gradient-to-b from-green-500 to-blue-800 text-white shadow-2xl fixed w-full z-50">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="ml-[5vh]">
                        <a href="/Dashboard" className="text-white text-2xl font-bold">Early Leave</a>
                    </div>

                    <div className="flex items-center">
                        <ul className="md:flex text-white items-center">
                            <a href="/Profile">
                                <li className="mr-6 flex items-center cursor-pointer hover:text-black transition duration-300">
                                    <img src={logoImage} className="w-[50px] h-[50px] rounded-full object-cover mr-2" alt="Profile" />
                                    <span>{trainee_id}</span>
                                </li>
                            </a>
                            <li>
                                <a className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center" onClick={handleLogoutClick}>
                                    <FaSignOutAlt className="h-5 w-5 mr-2" />
                                    <span className="mr-3">Logout</span>
                                </a>
                            </li>
                            <li className="relative">
                                <button
                                    className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center px-2"
                                    onClick={toggleDropdown}
                                >
                                    <FaBell className="h-5 w-5 text-white mr-3" />

                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                                        <div className="p-2 border-b">
                                            <span className="font-bold">Notifications</span>
                                        </div>
                                        <ul>
                                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 1</li>
                                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 2</li>
                                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 3</li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
           <div className="flex flex-row">
                {/* Sidebar */}
                <aside className="bg-gradient-to-b from-blue-800 to-green-500 text-white shadow-2xl h-[100vh] px-8 py-20" style={{
                    position: 'sticky',
                    top: '0',

                }}>
                    <img src={logoImage} className="w-[150px] absolute" alt="Logo" />

                    <nav>
                        <ul className="space-y-6 mb-6 py-20 mt-[9vh]">
                            <li>
                                <a href="/Dashboard" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <DashboardOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="/AddRequest" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <FileAddOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Request Leave</span>
                                </a>
                            </li>
                            <li>
                                <a href="/Requests" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <HistoryOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Leave History</span>
                                </a>
                            </li>
                            <li>
                                <a href="/Profile" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <UserOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Profile</span>
                                </a>
                            </li>
                            <li>
                                <a href="/Notifications" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <BellOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Notifications</span>
                                </a>
                            </li>
                            <li>
                                <a href="/Download" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                    <DownloadOutlined className="h-6 w-6 mr-3" />
                                    <span className="font-medium">Permissions</span>
                                </a>
                            </li>
                            <li>
                                <div className="mt-auto">
                                    <a

                                        className="flex items-center px-6 py-3 cursor-pointer hover:bg-red-600 rounded-md transition-all duration-200 ease-in-out"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default anchor click behavior
                                            handleLogoutClick(); // Call the function
                                        }}
                                    >
                                        <LogoutOutlined className="h-6 w-6 ml-2" />
                                        <span className="ml-3 nav-text text-lg font-medium text-white">Logout</span>
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <LogoutPopup
                            show={showPopup}
                            onClose={handleClosePopup}
                            onLogout={handleLogout}
                        />
                    </nav>
                </aside>

                <div className="flex-1 bg-gray-100 py-32 px-12 w-[190vh] rounded-md " style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',

                }}>
                    <div className="rounded-lg shadow-md p-6 w-[150vh] bg-gradient-to-b from-green-500 to-blue-800 ">
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
