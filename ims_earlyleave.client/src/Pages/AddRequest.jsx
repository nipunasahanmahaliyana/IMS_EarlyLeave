import React, { useState, useEffect, useRef } from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import backgroundImage from '../assets/Home.png';
import logoImage from '../assets/logo.png';
import axios from 'axios';
import LogoutPopup from './LogOut'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import {
    UserOutlined,
    BellOutlined,
    DownloadOutlined,
    LogoutOutlined,
    DashboardOutlined,
    FileAddOutlined,
    HistoryOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'; // Ant Design iconsrom '@ant-design/icons'; // Ant Design icons


function AddRequest() {
    const trainee_id = sessionStorage.getItem('Trainee ID') || "Guest"; // Fallback for missing username

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const datePickerRef = useRef(null); // Using ref for the date input
    const [showPopup, setShowPopup] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [supervisor_id, setSupervisor_ID] = useState(null);
    const [leave_type, setLeaveType] = useState('');
    const [name, setName] = useState('');
    const [nic, setNIC] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

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

    // Initialize flatpickr on date input
    useEffect(() => {
        if (datePickerRef.current) {
            flatpickr(datePickerRef.current, {
                dateFormat: "Y-m-d", // Single date format
                onChange: (selectedDates, dateStr) => {
                    setDate(dateStr);
                }
            });
        }

        fetchAssignedSupervisor();

    }, []);

 
    const fetchAssignedSupervisor = async () => {
        try {
            // Make the GET request to fetch the assigned supervisor details
            const response = await axios.get(`https://imsearlyleaveserver.azurewebsites.net/AssignedSupervisor?trainee_id=${trainee_id}`);

            // If the request is successful (status code 200)
            if (response.status === 200) {
                const supervisorData = response.data;
                setSupervisor_ID(supervisorData);  // Use the correct state setter function

                //console.log(supervisorData);
            } else {
                // Handle unexpected status codes that are not 200
                console.warn(`Unexpected response status: ${response.status}`);
                return { error: `Unexpected response from server: ${response.status}` };
            }
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error fetching assigned supervisor:', error);

            // Handle specific error cases
            if (error.response) {
                // Server responded with a status code outside the 2xx range
                const statusCode = error.response.status;
                const errorMessage = error.response.data?.message || 'Unknown error occurred on the server';

                // Handle specific status codes
                switch (statusCode) {
                    case 400:
                        return { error: 'Bad request. Please check the input data.' };
                    case 404:
                        return { error: 'Supervisor not found for this trainee.' };
                    case 500:
                        return { error: 'Server error. Please try again later.' };
                    default:
                        return { error: `Unexpected server error: ${errorMessage}` };
                }
            } else if (error.request) {
                // No response was received from the server (network issues)
                return { error: 'No response from server. Please check your network connection.' };
            } else {
                // Other errors that occurred while setting up the request
                return { error: `Request setup error: ${error.message}` };
            }
        }
    };

    // Validate form data
    const validateForm = () => {
        let tempErrors = {};
        if (!name) tempErrors.name = "Name is required.";
        if (!nic) tempErrors.nic = "NIC is required.";
        if (!date) tempErrors.date = "Date is required.";
        if (!time) tempErrors.time = "Time is required.";
        if (!supervisor_id) tempErrors.supervisor_ID = "Supervisor ID is required.";
        if (!leave_type) tempErrors.leave_type = "Leave type is required.";
        if (!reason) tempErrors.reason = "Reason is required.";
        return tempErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting');

        // Validate form before submission
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        //const time = new Date(`${formData.date}T${formData.time}:00`).toISOString(); // Adjust as necessary

        // Assuming formData.time is a string in HH:mm format
        const timeString = time; // e.g., "16:28"

        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':');

        // Format it to "HH:mm:ss" for SQL
        const sqlTimeString = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

        //console.log(sqlTimeString); // Outputs: "16:28:00"

       
        // Create a new FormData object
        const formData = new FormData();

        // Append each property
        formData.append("Name", name); // Adjust property names as per your backend expectations
        formData.append("NIC", nic);     // Use the correct casing
        formData.append("Date", date);   // Ensure this is formatted correctly for DateTime
        formData.append("Time", sqlTimeString); // Ensure time is formatted correctly
        formData.append("Reason", reason);
        formData.append("Supervisor_ID", supervisor_id);
        formData.append("Leave_type", leave_type);

        try {
            // Send the POST request
            const response = await axios.post(
                `https://imsearlyleaveserver.azurewebsites.net/AddRequest?trainee_id=${trainee_id}`,
                formData,  // Ensure data is stringified
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Handle success
            console.log("Success:", response.data);  // Log the success data
            alert("Request submitted successfully!");

            setName('');
            setLeaveType('');
            setDate('');
            setTime('');
            setNIC('');
            setReason('');

            const desc = (`You submitted a ${leave_type} leave request for ${date} | ${sqlTimeString}.`);

            try {
                const response = await axios.post(`https://imsearlyleaveserver.azurewebsites.net/AddRecentActivity?trainee_id=${trainee_id}&description=${desc}&status${0}`);
                console.log('Leave request added successfully:', response.data);
            } catch (error) {
                console.error('Error adding leave request:', error.response ? error.response.data : error.message);

            }


            setErrors({});
        } catch (error) {
            // Log detailed error response
            if (error.response) {
                console.error('Error:', error.response.data);  // Log the error response
                alert(error.response.data.message || 'Something went wrong');
            } else {
                console.error('Error:', error.message);  // Log general error
                alert('Something went wrong');
            }
        } finally {
            // Ensure the submitting state is reset
            setIsSubmitting(false);
        }

       
    };
    const checkForNewNotifications = async () => {
        try {
            const response = await axios.get('https://imsearlyleaveserver.azurewebsites.net/GetUnreadNotifications');
            const data = response.data;

            //console.log("Fetched notifications:", data); // Debug log

            if (data.length > 0) {
                setHasNewNotifications(true); // Show red mark
                setNotifications(data); // Store the notifications
            } else {
                setHasNewNotifications(false); // No new notifications
                setNotifications([]); // Clear notifications if none found
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            alert("Failed to fetch notifications. Please try again."); // User feedback
        }
    };


    const handleNotificationClick = async () => {
        // Toggle dropdown visibility
        setShowDropdown(!showDropdown);

        // Mark notifications as read only if dropdown is open
        if (showDropdown) {
            setHasNewNotifications(false); // Remove the red mark

            // Optionally, you can make a POST request to mark them as read in the backend
            try {
                await axios.post('https://imsearlyleaveserver.azurewebsites.net/MarkNotificationsAsRead'); // API call to mark as read
                checkForNewNotifications(); // Re-fetch notifications after marking as read
            } catch (error) {
                console.error("Error marking notifications as read:", error);
                alert("Failed to mark notifications as read."); // User feedback
            }
        }
    };



    return (
        <div className="min-h-screen flex">
            <nav className="bg-gradient-to-r from-green-400 to-blue-600 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="ml-[5vh]">
                        <a href="/Dashboard" className="text-white text-2xl font-bold">Early Leave</a>
                    </div>

                    <div className="flex items-center">
                        <ul className="md:flex text-white items-center">

                            <li className="relative">
                                {/* Notification Dropdown */}
                                <div className="relative">
                                    <button onClick={handleNotificationClick} className="relative">
                                        <FaBell className="h-5 w-5 mt-2 mr-4" />
                                        {hasNewNotifications && (
                                            <span className="absolute bottom-4 right-4 h-2 w-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>

                                    {showDropdown && notifications.length > 0 ? (
                                        <div className="absolute right-0 mt-2 bg-gradient-to-br from-gray-100 to-white shadow-lg rounded-lg p-4 w-64 z-10 transition-transform transform scale-95 hover:scale-100 duration-200">
                                            <h4 className="text-lg font-semibold mb-2 text-gray-800 border-b border-gray-300 pb-2">Notifications</h4>
                                            <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                                {notifications.map((notification) => (
                                                    <li key={notification.notifi_ID} className="p-2 border-b border-gray-200 hover:bg-gray-100 rounded-md flex items-start transition duration-150 ease-in-out">
                                                        <div className="bg-green-100 rounded-full p-2 mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-800">{notification.description}</p>
                                                            <small className="text-gray-500">{new Date(notification.timestamp).toLocaleDateString()}</small>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>


                                    ) : showDropdown && notifications.length === 0 ? (
                                        <div className="absolute mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                                            <p className="text-gray-600">Nothing new mate</p>
                                        </div>
                                    ) : null}
                                </div>
                            </li>

                            <li>
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
                                            <span className="ml-2 text-sm font-semibold">{trainee_id}</span>
                                    </a>
                                    </div>
                                
                           

                                <button className="cursor-pointer text-white hover:text-yellow-400 transition duration-300 flex items-center mr-4" onClick={handleLogoutClick}>
                                    <FaSignOutAlt className="h-5 w-5 ml-2 mr-2" />
                                </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

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
                            <a href="/Approve" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                <CheckCircleOutlined className="h-6 w-6 mr-3" />
                                <span className="font-medium">Approvel</span>
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

            <div className="flex-1 bg-black w-[170vh] min-h-screen p-32" style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="bg-gradient-to-b from-green-500 to-blue-800 rounded-lg shadow-md p-6 max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Request Leave</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="leave_type" className="block text-white font-bold mb-2">Leave Type:</label>
                            <select id="leave_type" value={leave_type} onChange={(e) => setLeaveType(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Leave Type</option>
                                <option value="vacation">Vacation</option>
                                <option value="sick">Sick</option>
                                <option value="personal">Personal</option>
                                <option value="professional">Professional</option>
                            </select>
                            {errors.leave_type && <p className="text-red-600">{errors.leave_type}</p>}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-white font-bold mb-2">Name:</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the name" />
                            {errors.name && <p className="text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="nic" className="block text-white font-bold mb-2">NIC:</label>
                            <input type="text" id="nic" value={nic} onChange={(e) => setNIC(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the NIC" />
                            {errors.nic && <p className="text-red-600">{errors.nic}</p>}
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-white font-bold mb-2">Date:</label>
                            <input type="text" id="date" ref={datePickerRef} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Select the date" />
                            {errors.date && <p className="text-red-600">{errors.date}</p>}
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-white font-bold mb-2">Time:</label>
                            <input
                                type="time" // Dynamically set type
                                id="time"
                                name="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.time && <p className="text-red-600">{errors.time}</p>}
                        </div>

                        <div>
                            <label htmlFor="supervisor_ID" className="block text-white font-bold mb-2">Supervisor ID: {supervisor_id} </label>
                            
                           
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-white font-bold mb-2">Reason:</label>
                            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your reason for leave" />
                            {errors.reason && <p className="text-red-600">{errors.reason}</p>}
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddRequest;
