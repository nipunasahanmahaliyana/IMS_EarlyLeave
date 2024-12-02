import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';
import logoImage from "/src/assets/logo.png";
import {

    UsergroupAddOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined,

} from '@ant-design/icons'; // Ant Design icons

var username = sessionStorage.getItem('Service_ID');

const MonthlyReport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [historyLeaves, setHistoryLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const [showPopup, setShowPopup] = useState(false);

    const handleLogoutClick = () => {
        setShowPopup(true); // Show the popup
    };

    // Fetch leave data dynamically based on search term (trainee ID or name)
    const getLeaveData = async (term) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:7247/Leaves?trainee_id=${term}`);
            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setLeaves(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getHistoryLeaves = async (term) => {
       
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:7247/ApprovedRequests?trainee_id=${term}`);
            if (response.status === 200) {
                console.log('History data retrieved successfully:', response.data);
                setHistoryLeaves(response.data);
            } else {
                console.error('Error retrieving leave history data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave history data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch leave data when the search term changes
    useEffect(() => {
        if (searchTerm) {
            getLeaveData(searchTerm);
            getHistoryLeaves(searchTerm);
        } else {
            setLeaves([]); // Clear data if searchTerm is empty
            setHistoryLeaves([]);
        }
    }, [searchTerm]);


    const handleDownload = async () => {
        try {
            console.log(historyLeaves);
            const response = await axios.post('https://localhost:7247/ExcelSheet', historyLeaves, {
                headers: {
                    'Content-Type': 'application/json' // Set the content type to application/json
                },
                responseType: 'blob' // Specify blob response type for file download
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'LeaveRequests.xlsx'); // Set the file name
            document.body.appendChild(link);
            link.click(); // Trigger download
            document.body.removeChild(link); // Clean up
        } catch (error) {
            console.error('Error downloading the Excel sheet', error);
        }
    };

    return (

        <div>
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-8">
            <h1 className="text-5xl font-bold mb-4 text-white">Monthly Leave Reports</h1>

            {/* Search Bar */}
            <div className="mb-8 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search by Trainee ID...."
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setLeaves([]); }}
                />
            </div>

            {/* Detailed Leave Records Table */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-screen-xl">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Detailed Leave Records</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainee ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leaves Taken</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaves.length > 0 ? (
                                leaves.map((report, index) => (
                                    <tr key={`${report.traineeID}-${report.month}-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.traineeID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.month}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.leaveBalance}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={handleDownload}
                                                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-blue-500 hover:to-green-400 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No records found {searchTerm}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </div>
    );
};

export default MonthlyReport;
