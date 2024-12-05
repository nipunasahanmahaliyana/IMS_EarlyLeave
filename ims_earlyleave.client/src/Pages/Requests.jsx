import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import backgroundImage from '../assets/Home.png';
import logoImage from '../assets/logo.png';
import LogoutPopup from './LogOut'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import {
    UserOutlined,
    BellOutlined,
    DownloadOutlined,
    LogoutOutlined, DashboardOutlined, FileAddOutlined, HistoryOutlined
} from '@ant-design/icons'; // Ant Design icons

const leaveTypes = ["All Types", "Vacation", "Sick", "Personal","Professional"];

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // Search input state
    const [leaveTypeFilter, setLeaveTypeFilter] = useState(''); // Leave type filter
    const username = sessionStorage.getItem('Trainee ID');
    const [showPopup, setShowPopup] = useState(false);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust the number of items per page as needed
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

    

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`https://imsearlyleaveserver.azurewebsites.net/ReqById?Trainee_ID=${username}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 border-solid rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Loading, please wait...</p>
            </div>
        );
    }

    // Apply filtering: search query and leave type filter
    const filteredRequests = requests.filter((request) => {
        const searchInLowerCase = searchQuery.toLowerCase();

        // Check if the search query matches any of the fields
        const matchesSearch =
            request.name.toLowerCase().includes(searchInLowerCase) ||
            request.trainee_ID.toLowerCase().includes(searchInLowerCase) ||
            request.nic.toLowerCase().includes(searchInLowerCase) ||
            request.supervisor_ID.toLowerCase().includes(searchInLowerCase) ||
            request.reason.toLowerCase().includes(searchInLowerCase);

        // Check if the leave type filter is applied
        const matchesLeaveType = leaveTypeFilter ? request.leave_type === leaveTypeFilter : true;

        return matchesSearch && matchesLeaveType;
    });
  
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
                            <a href="/Profile">
                                <li className="mr-6 flex items-center cursor-pointer hover:text-black transition duration-300">
                                    <img src={logoImage} className="w-[50px] h-[50px] rounded-full object-cover mr-2" alt="Profile" />
                                    <span>{username}</span>
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

            <div className="flex-1 bg-gray-100 py-32 px-12 w-[170vh] rounded-md " style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                
            }}>
                <div className="bg-white rounded-lg shadow-md p-4 w-auto bg-gradient-to-b from-blue-800 to-green-500 ">
                    <h2 className="text-2xl font-bold text-white mb-4">Leave Requests</h2>

                    <div className="mb-4 flex justify-between items-center rounded-md">
                        {/* Search Bar */}
                        <input
                            type="text"
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by Name, Trainee ID, NIC, Supervisor ID, Reason"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* Category Filter Dropdown */}
                        <select
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={leaveTypeFilter}
                            onChange={(e) => setLeaveTypeFilter(e.target.value)}
                        >
                            {leaveTypes.map((type, index) => (
                                <option key={index} value={type === "All Types" ? "" : type.toLowerCase()}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="bg-[#26BC74] text-white">
                                <tr className="px-4 py-2">
                                    <th className="px-4 py-2 text-center rounded-tl-[10px] rounded-bl-[10px] ">ID</th>
                                    <th className="px-4 py-2 text-center">Trainee ID</th>
                                    <th className="px-4 py-2 text-center">Name</th>
                                    <th className="px-4 py-2 text-center">NIC</th>
                                    <th className="px-4 py-2 text-center">Date</th>
                                    <th className="px-4 py-2 text-center">Time</th>
                                    <th className="px-4 py-2 text-center">Reason</th>
                                    <th className="px-4 py-2 text-center">Supervisor ID</th>
                                    <th className="px-4 py-2 text-center">Type</th>
                                    <th className="px-4 py-2 text-center rounded-tr-[10px] rounded-br-[10px]">Status</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 > 0 ? (
                                    currentItems.map((request) => (
                                        <tr className="hover:bg-black border-b border-gray-300" key={request.id}>

                                            <td className="px-4 py-2 text-white ">{request.id}</td>
                                            <td className="px-4 py-2  text-white">{request.trainee_ID}</td>
                                            <td className="px-4 py-2  text-white">{request.name}</td>
                                            <td className="px-4 py-2  text-white">{request.nic}</td>
                                            <td className="py-4 px-6  text-white">{new Date(request.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-white">{request.time}</td>
                                            <td className="px-4 py-2 text-white">{request.reason}</td>
                                            <td className="px-4 py-2  text-white">{request.supervisor_ID}</td>
                                            <td className="px-4 py-2  text-white">{request.leave_type}</td>
                                            <td className="mb-0 text-sm">
                                                <button
                                                    className={`w-24 py-1 rounded-full ${request.status === 0 ? 'text-white bg-orange-400' :
                                                        request.status === 1 ? 'text-white bg-green-800' :
                                                            request.status === 2 ? 'text-white bg-red-800' :
                                                                'text-gray-500'
                                                        }`}
                                                    disabled // Always disabled
                                                >
                                                    {request.status === 0 ? 'Pending' :
                                                        request.status === 1 ? 'Accepted' :
                                                            request.status === 2 ? 'Rejected' :
                                                                'Unknown Status' // Optional: Handle unexpected status values
                                                    }
                                                </button>
                                            </td>
                                           
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center text-white py-4">No requests found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <div>
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Requests;
