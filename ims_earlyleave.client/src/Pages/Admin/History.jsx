import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const RequestHistory = () => {
    const [requests] = useState([
        {
            id: 1,
            traineeName: 'John Doe',
            leaveType: 'Sick Leave',
            startDate: '2024-10-01',
            endDate: '2024-10-05',
            status: 'Approved',
            reason: 'Flu',
            details: 'Feeling unwell due to flu. Needed rest for recovery.',
        },
        {
            id: 2,
            traineeName: 'Jane Smith',
            leaveType: 'Vacation',
            startDate: '2024-09-20',
            endDate: '2024-09-25',
            status: 'Pending',
            reason: 'Family Reunion',
            details: 'Family gathering planned for the weekend.',
        },
        {
            id: 3,
            traineeName: 'Alice Johnson',
            leaveType: 'Personal Leave',
            startDate: '2024-08-15',
            endDate: '2024-08-18',
            status: 'Rejected',
            reason: 'Personal Issues',
            details: 'Unexpected personal issues that required attention.',
        },
        {
            id: 4,
            traineeName: 'Michael Brown',
            leaveType: 'Casual Leave',
            startDate: '2024-09-10',
            endDate: '2024-09-12',
            status: 'Approved',
            reason: 'Urgent Family Matter',
            details: 'Had to attend to a family emergency.',
        },
        // Add more sample data here
    ]);

    const [filteredRequests, setFilteredRequests] = useState(requests);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const historyRef = useRef();

    useEffect(() => {
        gsap.fromTo(historyRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            setFilteredRequests(requests.filter(request =>
                request.traineeName.toLowerCase().includes(lowercasedTerm) ||
                request.leaveType.toLowerCase().includes(lowercasedTerm)
            ));
        } else {
            setFilteredRequests(requests);
        }
    }, [searchTerm, requests]);

    const handleRowClick = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Leave Request History</h1>
            <div className="mb-6 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search by Trainee Name or Leave Type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div ref={historyRef} className="overflow-hidden rounded-lg shadow-lg bg-white w-full max-w-4xl">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-400 to-blue-600 text-white">
                                <th className="p-4 text-left">Trainee Name</th>
                                <th className="p-4 text-left">Leave Type</th>
                                <th className="p-4 text-left">Start Date</th>
                                <th className="p-4 text-left">End Date</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-100 transition duration-200 cursor-pointer" onClick={() => handleRowClick(request)}>
                                        <td className="p-4 border-b">{request.traineeName}</td>
                                        <td className="p-4 border-b">{request.leaveType}</td>
                                        <td className="p-4 border-b">{request.startDate}</td>
                                        <td className="p-4 border-b">{request.endDate}</td>
                                        <td className="p-4 border-b">
                                            <span className={`px-2 py-1 rounded-full text-white ${request.status === 'Approved' ? 'bg-green-500' : request.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b">{request.reason}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">No requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-2">Request Details</h2>
                        <p><strong>Trainee Name:</strong> {selectedRequest.traineeName}</p>
                        <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
                        <p><strong>Start Date:</strong> {selectedRequest.startDate}</p>
                        <p><strong>End Date:</strong> {selectedRequest.endDate}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                        <p><strong>Details:</strong> {selectedRequest.details}</p>
                        <button onClick={handleCloseDetails} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestHistory;
