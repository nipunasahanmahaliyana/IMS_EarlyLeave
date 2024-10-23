import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { gsap } from 'gsap';

const MonthlyReport = () => {
    const [reports] = useState([
        {
            traineeName: 'John Doe',
            leaveData: [2, 1, 0, 1, 3, 2, 0, 1, 2, 0, 1, 2],
            detailedLeave: [
                { month: 'January', days: 2 },
                { month: 'February', days: 1 },
                { month: 'March', days: 0 },
                { month: 'April', days: 1 },
                { month: 'May', days: 3 },
                { month: 'June', days: 2 },
                { month: 'July', days: 0 },
                { month: 'August', days: 1 },
                { month: 'September', days: 2 },
                { month: 'October', days: 0 },
                { month: 'November', days: 1 },
                { month: 'December', days: 2 },
            ]
        },
        {
            traineeName: 'Jane Smith',
            leaveData: [1, 0, 1, 2, 1, 0, 2, 1, 0, 1, 0, 1],
            detailedLeave: [
                { month: 'January', days: 1 },
                { month: 'February', days: 0 },
                { month: 'March', days: 1 },
                { month: 'April', days: 2 },
                { month: 'May', days: 1 },
                { month: 'June', days: 0 },
                { month: 'July', days: 2 },
                { month: 'August', days: 1 },
                { month: 'September', days: 0 },
                { month: 'October', days: 1 },
                { month: 'November', days: 0 },
                { month: 'December', days: 1 },
            ]
        },
        // Additional trainee reports can be added here
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        gsap.from('.report-card', {
            opacity: 0,
            scale: 0.5,
            stagger: 0.2,
            duration: 0.5,
            ease: "power2.out"
        });
    }, []);

    // Filtered reports based on search term
    const filteredReports = reports.filter(report =>
        report.traineeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-8">
            <h1 className="text-5xl font-bold mb-4 text-white">Monthly Leave Reports</h1>

            {/* Search Bar */}
            <div className="mb-8 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search by Trainee Name..."
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 w-full max-w-screen-xl">
                {filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                        <div key={index} className="report-card bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl transform hover:scale-105">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{report.traineeName}</h2>
                            <Bar
                                data={{
                                    labels: [
                                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                                    ],
                                    datasets: [{
                                        label: 'Leaves Taken',
                                        data: report.leaveData,
                                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Number of Leaves'
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        }
                                    }
                                }}
                                height={200}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-white">No reports found for "{searchTerm}"</div>
                )}
            </div>

            {/* Detailed Leave Records Table */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-screen-xl">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Detailed Leave Records</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainee Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leaves Taken</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.map((report) => (
                            report.detailedLeave.map((leave, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.traineeName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.month}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.days}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyReport;
