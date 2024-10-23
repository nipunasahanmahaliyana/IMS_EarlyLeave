import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    FileOutlined,
    LogoutOutlined
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
    // Sample data for the bar chart
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'New Users',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'User Activity Overview'
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="bg-gradient-to-r from-blue-900 to-purple-800 w-64 space-y-6 py-7 px-2 flex flex-col shadow-lg">
                <a href="#" className="text-white flex items-center space-x-2 px-4">
                    <DashboardOutlined className="text-2xl" />
                    <span className="text-2xl font-extrabold">Admin Panel</span>
                </a>

                <nav className="mt-10">
                    <a href="/ManageUsers" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <UserOutlined className="mr-2 text-xl" />
                        Users
                    </a>
                    <a href="/Report" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <FileOutlined className="mr-2 text-xl" />
                        Reports
                    </a>
                    <a href="/History" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <SettingOutlined className="mr-2 text-xl" />
                        History
                    </a>
                    <a href="/Approve" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <SettingOutlined className="mr-2 text-xl" />
                        Approve
                    </a>
                    <a href="/AdminDashboard" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <SettingOutlined className="mr-2 text-xl" />
                        Dashboard
                    </a>
                    <a href="#" className="text-gray-300 flex items-center px-4 py-2 hover:bg-purple-700 hover:text-white transition duration-300">
                        <LogoutOutlined className="mr-2 text-xl" />
                        Logout
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-10">
                {/* Dashboard Heading */}
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Cards for statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Total Users</h2>
                        <p className="text-4xl font-semibold">1,234</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Active Sessions</h2>
                        <p className="text-4xl font-semibold">567</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                        <p className="text-4xl font-semibold">23</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">User Activity Overview</h2>
                    <div className="h-64">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Activity</h2>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center">
                            <span className="text-gray-600">User "John Doe" created a new request</span>
                            <span className="text-gray-500 text-sm">2 hours ago</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-gray-600">User "Jane Smith" updated her profile</span>
                            <span className="text-gray-500 text-sm">5 hours ago</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-gray-600">Admin "Mike" approved a request</span>
                            <span className="text-gray-500 text-sm">1 day ago</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
