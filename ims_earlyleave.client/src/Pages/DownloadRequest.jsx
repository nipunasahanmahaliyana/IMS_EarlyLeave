import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message component
import logoImage from '../assets/logo.png';
import backgroundImage from '../assets/Home.png';
import { useNavigate } from 'react-router-dom';
import LogoutPopup from './LogOut'; // Adjust the import path as needed
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



const RequestForm = () => {
    const trainee_id = sessionStorage.getItem('Trainee ID') || "Guest"; // Fallback for missing username

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = sessionStorage.getItem('Trainee ID');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`https://localhost:7247/ReqById?Trainee_ID=${username}`);
                setRequests(response.data);
                //message.success('Requests fetched successfully!');
            } catch (err) {
                message.error('Failed to fetch requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [username]);

    const downloadPDF = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7247/GenerateLeaveRequestPDF?id=${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'LeaveRequest.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('PDF downloaded successfully!');
        } catch (err) {
            message.error('Failed to download PDF. Please try again.');
        }
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


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

    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;

    // Calculate total pages
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    // Paginate the requests
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

    // Handle page change
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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

            <div className="flex-1 bg-black w-[170vh] min-h-screen p-32" style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
        
            <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">Leave Requests</h1>

            {loading && <p className="text-center text-lg text-gray-700">Loading...</p>}

                <div className="overflow-x-auto shadow-lg rounded-lg  via-white to-indigo-100 p-6">
                    <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden bg-gradient-to-b from-blue-800 to-green-500 text-white">
                        <thead>
                            <tr className="bg-[#26BC74] text-white">
                                <th className="py-4 px-6 text-left text-lg">Leave Id</th>
                                <th className="py-4 px-6 text-left text-lg">Name</th>
                                <th className="py-4 px-6 text-left text-lg">NIC</th>
                                <th className="py-4 px-6 text-left text-lg">Date</th>
                                <th className="py-4 px-6 text-left text-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-black transition duration-300">
                                    <td className="py-2 px-6 border-b">{request.id}</td>
                                    <td className="py-4 px-6 border-b">{request.name}</td>
                                    <td className="py-4 px-6 border-b">{request.nic}</td>
                                    <td className="py-4 px-6 border-b">
                                        {new Date(request.acceptDateTime).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 border-b">
                                        <button
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-5 rounded-full shadow-lg hover:shadow-xl transition duration-300 hover:scale-105"
                                            onClick={() => downloadPDF(request.id)}
                                        >
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                } bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300`}
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 text-lg">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                } bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300`}
                            onClick={goToNextPage}
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

export default RequestForm;
