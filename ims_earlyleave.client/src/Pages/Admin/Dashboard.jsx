import { useState, useEffect} from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    DashboardOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    HomeOutlined

} from '@ant-design/icons';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalSessions, setTotalSessions] = useState(null);
    const [PendingRequestsCount, setPendingRequestCount] = useState(null);
    const [recentActivities, setRecentActities] = useState([]);

    const username = sessionStorage.getItem('Service_ID');

    useEffect(() => {
        fecthUserCount();
        fecthSessionCount(username);
        fecthPendingRequestCount(username);
        fecthRecentActivities();
        fetchData();
    });

    const fecthUserCount = async () => {
        try {
            
            const response = await axios.get(`https://localhost:7247/TotalUsers`);

            if (response.status === 200) {
                //console.log('User Count retrieved successfully:', response.data);
                setTotalUsers(response.data);
            } else {
                console.error('Error retrieving data:');
            }


        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } 
    };

    const fecthSessionCount = async (username) => {
        //supervisor interns only
        try {

            const response = await axios.get(`https://localhost:7247/NumberOfSessions?username=${username}`);

            if (response.status === 200) {
                //console.log('Session Count retrieved successfully:', response.data);
                setTotalSessions(response.data);
            } else {
                console.error('Error retrieving data:');
            }


        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        }
    };

    const fecthPendingRequestCount = async (username) => {
        try {

            const response = await axios.get(`https://localhost:7247/PendingRequestsCountbySupervisor?Supervisor_ID=${username}`);

            if (response.status === 200) {
                //console.log('Pending Request Count retrieved successfully:', response.data);
                setPendingRequestCount(response.data);
            } else {
                console.error('Error retrieving data:');
            }


        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        }
    };


    const fecthRecentActivities = async () => {
        try {

            const response = await axios.get(`https://localhost:7247/RecentActivities`);

            if (response.status === 200) {
                //console.log('Recent Actitvity retrieved successfully:', response.data);
                setRecentActities(response.data);
            } else {
                console.error('Error retrieving data:');
            }


        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        }
    };
    // Sample data for the bar chart
    // State for the chart data
    const [chartData, setChartData] = useState({
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ],
        datasets: [
            {
                label: 'Assigned Trainees',
                data: Array(12).fill(0), // Initialize with zeros for all months
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Assigend Trainees Count Overview'
            }
        }
    };

    const fetchData = async () => {
        try {
            // Fetch data from your API using Axios
            const response = await axios.get(`https://localhost:7247/TraineeCountOnSupervisor?supervisor_id=19559`);
         

            const data = response.data;

            // Map fetched data to the correct months
            const monthIndexMap = {
                January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
            };

            // Create an updated data array
            const updatedData = Array(12).fill(0); // Default to 0 for all months
            data.forEach(item => {
                const monthIndex = monthIndexMap[item.month];
                if (monthIndex !== undefined) {
                    updatedData[monthIndex] = item.count; // Assign count to the correct month
                }
            });

            // Update chart data
            setChartData(prevData => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: updatedData,
                    },
                ],
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="bg-gradient-to-r from-blue-900 to-purple-800 w-64 space-y-6 py-7 px-2 flex flex-col shadow-lg">
                <a href="/AdminDashboard" className="text-white flex items-center space-x-2 px-4">
                    <DashboardOutlined className="text-2xl" />
                    <span className="text-2xl font-extrabold">Admin Panel</span>
                </a>

                <nav className="mt-10 space-y-1">
                    <a href="/AdminDashboard" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <HomeOutlined className="mr-2 text-xl" />
                        <span>Dashboard</span>
                    </a>
                    <a href="/ManageUsers" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <UsergroupAddOutlined className="mr-2 text-xl" />
                        <span>Manage Users</span>
                    </a>
                    <a href="/Report" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <FileTextOutlined className="mr-2 text-xl" />
                        <span>Reports</span>
                    </a>
                    <a href="/History" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <HistoryOutlined className="mr-2 text-xl" />
                        <span>History</span>
                    </a>
                    <a href="/Approve" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <CheckCircleOutlined className="mr-2 text-xl" />
                        <span>Approve</span>
                    </a>

                    <a href="/Logout" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <LogoutOutlined className="mr-2 text-xl" />
                        <span>Logout</span>
                    </a>
                </nav>
            </aside>


            {/* Main Content */}
            <div className="flex-1 p-10  bg-gradient-to-r from-green-400 to-blue-500">
                {/* Dashboard Heading */}
                <h1 className="text-4xl font-bold text-white mb-6">Admin Dashboard - {username ? username : "Guest"}</h1>

                {/* Cards for statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Total Users</h2>
                        <p className="text-4xl font-semibold">{totalUsers}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Active Sessions</h2>
                        <p className="text-4xl font-semibold">{totalSessions}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                        <p className="text-4xl font-semibold">{PendingRequestsCount}</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-[160vh]">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Assigned Trainees Overview</h2>
                    <div className="h-[60vh]">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow-md rounded-lg p-6 overflow-scroll h-[50vh]">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Activity</h2>
                    <ul>
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => {
                                let statusText;

                                // Use an if statement to determine the status
                                if (activity.status === 1) {
                                    statusText = "approved";
                                } else if (activity.status === 2) {
                                    statusText = "rejected";
                                } else if (activity.status === 0) {
                                    statusText = "pending";
                                } else {
                                    statusText = "unknown";
                                }

                                return (
                                    <li
                                        key={activity.activityID}
                                        className="mb-3 p-3 bg-white rounded-md shadow-sm"
                                    >
                                        <p className="text-gray-800">
                                            <span className="font-medium">
                                                Trainee ID: {activity.trainee_ID}
                                            </span>
                                        </p>
                                        <p className="text-gray-800">
                                            {activity.description}
                                            <span className="text-blue-500 font-medium">{statusText}.</span>
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Timestamp: {new Date(activity.timeStamp).toLocaleString()}
                                        </p>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">No recent activities found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
