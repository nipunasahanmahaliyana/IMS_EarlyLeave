import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonthlyReport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [historyLeaves, setHistoryLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

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
    );
};

export default MonthlyReport;
