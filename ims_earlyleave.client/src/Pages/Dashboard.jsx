import ApexCharts from 'react-apexcharts';
import backgroundImage from '../assets/Home.png';
import logoImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LogoutPopup from './LogOut'; // Adjust the import path as needed
import Notifications from './Notifications';
import PDFDownload from './PDFDownload';
import { FaSignOutAlt, FaBell} from 'react-icons/fa';
import {
    UserOutlined,
    BellOutlined,
    DownloadOutlined,
    LogoutOutlined,
    DashboardOutlined,
    FileAddOutlined,
    HistoryOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'; // Ant Design icons
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

Chart.register(...registerables);
Chart.register(ChartDataLabels)

const imageBase64 = sessionStorage.getItem("ImageBase64");

const Dashboard = () => {

    const [days, setDays] = useState([]);
    const [countReq, setCountReq] = useState([]);
    const username = sessionStorage.getItem('Trainee ID');
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [req, setReq] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState([]);
    const [weekNumbers, setWeekNumbers] = useState([]);
    const [totalRequests, setTotalRequests] = useState([]);
    const [requests, setRequests] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

    // Poll the backend every 10 seconds for new notifications
    useEffect(() => {
        const interval = setInterval(checkForNewNotifications, 1000);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

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


    useEffect(() => {
        const getCurrentMonthName = () => {
            const date = new Date(); // Get current date
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const monthIndex = date.getMonth(); // getMonth() returns 0-11
            const monthName = monthNames[monthIndex]
            return monthName; // Return the corresponding month name
        };

        setCurrentMonth(getCurrentMonthName());

    },[])
    // Function to fetch leave requests
    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get('https://imsearlyleaveserver.azurewebsites.net/RecentActivities'); // Update with your actual API endpoint
            setRequests(response.data); // Assuming the response data is an array of requests
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const options = {
        series: [{
            name: 'Days Taken',
            data: countReq // Sample data
        }],
        chart: {
            height: 350, // Adjust as needed
            type: 'bar',
            toolbar: { show: false }
        },
        xaxis: {
            categories: days
        },
        colors: ['#3B82F6'], // Example: Using a blue color from Tailwind
        dataLabels: { enabled: false } // Hide data labels for cleaner look
    };

    useEffect(() => {
        const fetchLeaveCounts = async () => {
            try {
                const response = await axios.get('https://imsearlyleaveserver.azurewebsites.net/CurrentMonthLeaveCounts');
                const leaveData = response.data;

                // Extract leave types and counts into separate arrays
                const types = leaveData.map(item => item.leaveType);
                const counts = leaveData.map(item => item.totalRequests);

                setLeaveTypes(types);
                setLeaveCounts(counts);
                console.log(types);
                console.log(counts);

            } catch (error) {
                console.error("Error fetching leave counts:", error);
                // Handle error as needed (e.g., show a notification)
            }
        };

        fetchLeaveCounts();
    }, []); // Empty dependency array ensures this runs only once on component mount

    useEffect(() => {
        const today = new Date();
        const newDays = []; // Temporary array to hold the days

        // Loop through the last four days
        for (let i = 0; i < 4; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Format date as YYYY-MM-DD
            const formattedDate = date.toISOString().split('T')[0];
            newDays.push(formattedDate); // Add formatted date to newDays array
        }

        // Reverse the days so the most recent date is last
        const reversedDays = newDays.reverse();
        setDays(reversedDays);

        // Example of a constant array (if needed)
        const constantDaysArray = reversedDays; // This can be used if needed elsewhere

        console.log('Constant Days Array:', constantDaysArray); // Logging the constant array

    }, []);

    
    useEffect(() => {
        const fetchTotalLeaveRequests = async () => {
            console.log("Counting....");
            try {
                const requests = []; // Array to hold total requests
                for (let i = 0; i < days.length; i++) {
                    try {
                        const response = await axios.get(`https://imsearlyleaveserver.azurewebsites.net/TotalLeaveCount?date=${days[i]}`);
                        // Assuming the response structure is { date: '2024-10-15', totalRequests: 0 }
                        requests.push(response.data.totalRequests); // Push only the totalRequests value
                        console.log(`Total requests for ${days[i]}:`, response.data.totalRequests);
                    } catch (error) {
                        console.error(`Error fetching data for date ${days[i]}:`, error);
                        requests.push(0); // Push 0 in case of error
                    }
                }
                setCountReq(requests); // Set the total requests in state
                console.log('Total Requests:', requests); // Log the final array of counts
            } catch (error) {
                // Check if the error is from the request or the response
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error('Server Error:', error.response.data);

                    if (error.response.status === 400) {
                        console.error('Bad Request:', error.response.data.error);
                    } else if (error.response.status === 500) {
                        console.error('Server Error:', error.response.data.error || 'Internal Server Error.');
                    } else {
                        console.error('Unknown Server Error:', error.response.data);
                    }
                } else if (error.request) {
                    // No response was received, request was made but no response
                    console.error('Network Error: No response received from the server.');
                } else {
                    // Something else went wrong during the setup of the request
                    console.error('Error:', error.message);
                }

                // Optionally rethrow the error if you want to handle it further up the chain
                throw error;
            }
        };

        // Only fetch leave counts if days is populated
        if (days.length > 0) {
            fetchTotalLeaveRequests();
        }
    }, [days]); // This runs whenever days changes


    const fetchDatas = async () => {
        try {

            const responsePending = await axios.get('https://imsearlyleaveserver.azurewebsites.net/PendingRequests');

            setReq(responsePending.data)// Convert response data to a 32-bit integer and set count
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {
        const fetchWeeklyLeaveCounts = async () => {
            try {
                const response = await axios.get('https://imsearlyleaveserver.azurewebsites.net/CurrentMonthWeeklyLeaveCounts');

                const leaveCounts = response.data;

                // Extract week numbers and total requests into separate arrays
                const weeksArray = leaveCounts.map(item => item.weekNumber);
                const requestsArray = leaveCounts.map(item => item.totalRequests);

                // Set the state with the arrays
                setWeekNumbers(weeksArray);
                setTotalRequests(requestsArray);

                console.log('Week Numbers:', weeksArray);
                console.log('Total Requests:', requestsArray);

            } catch (error) {
                if (error.response) {
                    // Server responded with a status code out of the range of 2xx
                    console.error('Server Error:', error.response.data);
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error('Network Error:', error.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Error:', error.message);
                }
            }
        };

        fetchWeeklyLeaveCounts(); // Call the function inside useEffect when the component loads
    }, []); // Empty dependency array means this runs only once, when the component mounts


    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await axios.get(`https://imsearlyleaveserver.azurewebsites.net/leaveCount?trainee_id=${username}`);
                
                setCount(response.data);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetch function
        fetchDatas(); // Call the fetch function
  
    }, []); // Empty dependency array means this effect runs once on component mount


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
    
   
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

 

    // Sample leave requests data for various charts
    const leaveRequestsData = {
        labels: weekNumbers,
        datasets: [
            {
                label: 'Leave Requests',
                data: totalRequests,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const pieChartData = {
        labels: leaveTypes,
        datasets: [
            {
                label: 'Leave Type Distribution',
                data: leaveCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };


    return (
    <>
            <div className="min-h-screen flex " style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
            }}>

    <nav className="bg-gradient-to-r from-green-400 to-blue-600 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
    <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Brand */}
        <div className="flex items-center">
            <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full mr-3 transition-transform transform hover:scale-110" />
            <a href="/Dashboard" className="text-3xl font-extrabold tracking-wide hover:text-blue-300 transition duration-300">
                Early Leave
            </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
            <a href="/AddRequest" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                <FileAddOutlined className="h-5 w-5 mr-2" />
                <span className="font-semibold">Request Leave</span>
            </a>
            <a href="/Requests" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                <HistoryOutlined className="h-5 w-5 mr-2" />
                <span className="font-semibold">Leave History</span>
            </a>
            <a href="/Profile" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                <UserOutlined className="h-5 w-5 mr-2" />
                <span className="font-semibold">Profile</span>
            </a>
            <a href="/Download" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                <DownloadOutlined className="h-5 w-5 mr-2" />
                <span className="font-semibold">Permissions</span>
            </a>
        </div>

                        {/* Notification Dropdown */}
                        <div className="relative">
                            <button onClick={handleNotificationClick} className="relative">
                                <FaBell className="h-5 w-5  ml-[30vh]" />
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



                <div className="flex-1 p-8 py-20 mt-9">
                    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                        <div className="bg-white rounded-lg shadow-lg p-6 bg-gradient-to-br from-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
                            <div className="flex flex-col mb-4">
                                <h2 className=" text-xl font-extrabold text-gray-900 mb-6 p-2  rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">Leave Balance - {currentMonth}</h2>
                                <div className="flex flex-row items-center mt-2">
                                    <span className="text-5xl font-bold text-blue-500 mr-4">{count}<br /></span>
                                    <div className="ml-5 bg-blue-500 rounded-full p-4 px-20 shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-gray-600 text-sm">Total days</span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 mb-2">Pending Leaves</h2>
                            <ul className="space-y-3 max-h-[30vh] overflow-hidden hover:overflow-y-auto ">
                                {req.length > 0 ? (
                                    req.slice(0, 5).map((request) => (
                                        <li className="flex items-center p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200" key={request.id}>
                                            <div className="bg-red-200 rounded-full p-2 mr-3 shadow-md hover:shadow-lg transition-shadow duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-800">{request.leave_type} Leave:</span>
                                                <p className="text-black text-sm">ReqID: {request.id} (Pending)</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-sm font-semibold hover:bg-blue-600 transition duration-200">
                                                    View
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center justify-center p-3 text-gray-500">No pending requests.</li>
                                )}
                            </ul>
                        </div>

                        {/* Leave Trends and Analytics Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6 col-span-2 bg-gradient-to-b from-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
                            <h2 className="w-[70vh] text-xl font-extrabold text-gray-900 mb-6 p-2  rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">Leave Trends - {currentMonth}</h2>
                            <div className="relative">
                                <ApexCharts
                                    options={{
                                        ...options,
                                        chart: {
                                            ...options.chart,
                                            toolbar: { show: false },
                                            dropShadow: {
                                                enabled: true,
                                                top: 2,
                                                left: 2,
                                                blur: 3,
                                                opacity: 0.2,
                                            },
                                        },
                                        xaxis: {
                                            ...options.xaxis,
                                            labels: {
                                                style: {
                                                    colors: '#4A5568',
                                                },
                                            },
                                        },
                                        yaxis: {
                                            ...options.yaxis,
                                            labels: {
                                                style: {
                                                    colors: '#4A5568',
                                                },
                                            },
                                        },
                                        grid: {
                                            borderColor: '#E2E8F0',
                                        },
                                        tooltip: {
                                            theme: 'dark',
                                        },
                                    }}
                                    series={options.series}
                                    type="bar"
                                    height={350}
                                />
                           
                            </div>
                        </div>



                        <div className="bg-white rounded-lg shadow-xl p-6 bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out relative">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="w-[40vh] text-xl font-extrabold text-gray-900 mb-6 p-2  rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">Leave Type Distribution - {currentMonth}</h2>
                                
                            </div>


                            <div className="flex items-center justify-center">
                                <Pie
                                    data={pieChartData}
                                    options={{
                                        animation: {
                                            animateScale: true,
                                            animateRotate: true
                                        },
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top',
                                            },
                                        }
                                    }}
                                />
                            </div>

                            {/* Optional subtle border and shadow */}
                            <div className="absolute inset-0 rounded-lg border border-blue-200 shadow-inner"></div>
                        </div>




                        {/* Recent Activity Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6 bg-gradient-to-br from-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 p-2  rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">News Feed</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start p-3 hover:bg-gray-50 hover:shadow-md transition-all duration-300 ease-in-out rounded-lg border-b border-gray-200">
                                    <div className="bg-green-100 rounded-full p-2 mr-3 transform hover:scale-110 transition-transform duration-200 ease-in-out">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-800">Your vacation request for 2024-09-24 was <span className="font-medium">approved</span>.</p>
                                        <span className="text-gray-500 text-sm font-medium">2024-09-24</span>
                                    </div>
                                </li>
                                <li className="flex items-start p-3 hover:bg-gray-50 hover:shadow-md transition-all duration-300 ease-in-out rounded-lg">
                                    <div className="bg-yellow-100 rounded-full p-2 mr-3 transform hover:scale-110 transition-transform duration-200 ease-in-out">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-800">You submitted a sick leave request for 2024-09-23.</p>
                                        <span className="text-gray-500 text-sm font-medium">2024-09-23</span>
                                    </div>
                                </li>
                            </ul>
                        </div>


                        {/* Leave Requests Over Time Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6 col-span-2 bg-gradient-to-b from-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="w-[70vh] text-xl font-extrabold text-gray-900 mb-6 p-2  rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">Leave Requests Weekly - {currentMonth}</h2>
                               
                            </div>
                            <Line
                                data={leaveRequestsData}
                                options={{
                                    maintainAspectRatio: true,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                            labels: {
                                                color: '#4A5568' // Text color for legend
                                            }
                                        },
                                        title: {
                                            display: true,
                                            text: 'Leave Requests Trend',
                                            font: {
                                                size: 18,
                                                weight: 'bold',
                                            },
                                            color: '#4A5568' // Text color for title
                                        },
                                        tooltip: {
                                            enabled: true, // Enable tooltips to show on hover
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Customize label format
                                                },
                                            },
                                            backgroundColor: '#ffffff', // Tooltip background color
                                            titleColor: '#4A5568', // Tooltip title color
                                            bodyColor: '#4A5568', // Tooltip text color
                                            borderColor: '#E2E8F0', // Tooltip border color
                                            borderWidth: 1,
                                            bodyFont: {
                                                size: 14,
                                            },
                                            titleFont: {
                                                size: 16,
                                                weight: 'bold',
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Weeks',
                                                color: '#4A5568',
                                                font: {
                                                    size: 14,
                                                    weight: 'medium'
                                                }
                                            },
                                            ticks: {
                                                color: '#4A5568' // X-axis label color
                                            }
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Number of Requests',
                                                color: '#4A5568',
                                                font: {
                                                    size: 14,
                                                    weight: 'medium'
                                                }
                                            },
                                            ticks: {
                                                color: '#4A5568', // Y-axis label color
                                            },
                                            beginAtZero: true,
                                            grid: {
                                                borderColor: '#E2E8F0' // Lighter grid line color
                                            }
                                        },
                                    },
                                }}
                            />
                        </div>
                        {/* News Feed Card */}
                        <div className="max-h-[62vh] overflow-hidden hover:overflow-y-auto bg-white rounded-lg shadow-lg p-6 bg-gradient-to-br from-cyan-100 to-blue-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6 p-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg border-b-2 border-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                Recent Activity
                            </h2>


                            <ul className="space-y-4 ">
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <li key={index} className="flex items-start p-3 hover:bg-gray-50 hover:shadow-md transition-all duration-300 ease-in-out rounded-lg border-b border-gray-200">
                                            <div className={`rounded-full p-2 mr-3 transform hover:scale-110 transition-transform duration-200 ease-in-out ${request.Status === 1 ? 'bg-green-100' : 'bg-yellow-100'
                                                }`}>
                                                {request.status === 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : request.status === 2 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-gray-800">
                                                    {request.description}
                                                    <span className="font-medium">{request.status === 1
                                                        ? 'approved'
                                                        : request.status === 2
                                                            ? 'rejected'
                                                            : 'pending'}</span>.
                                                </p>
                  
                                                <span className="text-gray-500 text-sm font-medium"> {request.timeStamp}</span>
                                               
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center justify-center p-3 text-gray-500">No recent activities.</li>
                                )}
                            </ul>
                        </div>
                    </main>
                </div>

            </div>
            <footer className="bg-gradient-to-r from-green-400 to-blue-600 text-white shadow-xl text-white py-5 relative overflow-hidden">
                <div className="absolute "></div>
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full">
                        <p className="text-sm text-center md:text-left mb-4 md:mb-0 opacity-80">© 2024 SLT Mobitel Digital Platform. All rights reserved.</p>
                        <div className="flex space-x-8 md:mt-0">
                            {[
                                { href: 'https://facebook.com', icon: <FaFacebook size={20} />, label: 'Facebook' },
                                { href: 'https://twitter.com', icon: <FaTwitter size={20} />, label: 'Twitter' },
                                { href: 'https://instagram.com', icon: <FaInstagram size={20} />, label: 'Instagram' },
                                { href: 'https://linkedin.com', icon: <FaLinkedin size={20} />, label: 'LinkedIn' }
                            ].map(({ href, icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group flex items-center transition-transform transform hover:text-gray-300 duration-300"
                                >
                                    <div className="flex items-center justify-center bg-blue-600 w-10 h-10 rounded-full shadow-lg transition-transform transform group-hover:scale-110">
                                        {icon}
                                    </div>
                                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-14 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <p className="text-xs text-center opacity-70">Follow us for updates and news!</p>
                    </div>
                </div>
            </footer>


        </>
    );
}

export default Dashboard;