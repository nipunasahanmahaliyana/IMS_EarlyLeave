import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from "axios";

const RequestHistory = () => {

    var trainee_id = sessionStorage.getItem('Trainee ID');
    const [requests,setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const historyRef = useRef();


    const getLeaveData = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`https://localhost:7247/ReqBySupervisor?supID=19559`);
            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setRequests(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getLeaveDataByTraineeID = async (term) => {
        try {
            setLoading(true);
            const response = await axios.post(`https://localhost:7247/ReqBySupervisorandTrainee?supID=19559&trainee_id=${term}`);
            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setRequests(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        gsap.fromTo(historyRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
        getLeaveData();
    }, []);

   

    const handleRowClick = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Leave Request History</h1>
            {/* Search Bar */}
            <div className="mb-8 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search by Trainee ID...."
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);

                        if (value === '') {
                            // If the value is empty, call the method to get all leave data
                            getLeaveData();
                        } else {
                            // If there is a value, call the method to get data by Trainee ID
                            getLeaveDataByTraineeID(value);
                        }
                    }}

                />
            </div>
            <div ref={historyRef} className="overflow-hidden rounded-lg shadow-lg bg-white w-full max-w-[200vh]">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                                <tr className="bg-gradient-to-r from-green-400 to-blue-600 text-white">
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Trainee ID</th>
                                    <th className="p-4 text-left">Trainee Name</th>
                                    <th className="p-4 text-left">NIC</th>
                                    <th className="p-4 text-left">Date</th>
                                    <th className="p-4 text-left">Time</th>
                                    <th className="p-4 text-left">Reason</th>
                                    <th className="p-4 text-left">Supervisor ID</th>
                                    <th className="p-4 text-left">Leave Type</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Accepted DateTime</th>
                                    
                            </tr>
                        </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-100 transition duration-200 cursor-pointer" onClick={() => handleRowClick(request)}>
                                        <td className="p-4 border-b text-black">{request.id}</td>
                                        <td className="p-4 border-b text-black">{request.trainee_ID}</td>
                                        <td className="p-4 border-b text-black">{request.name}</td>
                                        <td className="p-4 border-b text-black">{request.nic}</td>
                                        <td className="p-4 border-b text-black">{request.date}</td>
                                        <td className="p-4 border-b text-black">{request.time}</td>
                                        <td className="p-4 border-b text-black">{request.reason}</td>
                                        <td className="p-4 border-b text-black">{request.supervisor_ID}</td>
                                        <td className="p-4 border-b text-black">{request.leave_type}</td>
                                        
                                        <td className="p-4 border-b text-black">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white ${request.status === 1
                                                        ? 'bg-green-500' // Approved
                                                        : request.status === 2
                                                        ? 'bg-red-500' // Rejected
                                                        : ' bg-yellow-500' // Pending (or other statuses)
                                                    }`}
                                            >
                                                {request.status === 1
                                                    ? 'Approved'
                                                    : request.status === 2
                                                        ? ' Rejected'
                                                        : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b text-black">{request.acceptDateTime}</td>
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
                        <h2 className="text-xl font-bold mb-2">Leave Request Details</h2>
                        <p><strong>Leave ID:</strong> {selectedRequest.id}</p>
                        <p><strong>Trainee ID:</strong> {selectedRequest.trainee_ID}</p>
                        <p><strong>Trainee Name:</strong> {selectedRequest.name}</p>
                        <p><strong>Trainee NIC:</strong> {selectedRequest.nic}</p>
                        <p><strong>Leave Date:</strong> {selectedRequest.date}</p>
                        <p><strong>Leave Time:</strong> {selectedRequest.time}</p>
                        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                        <p><strong>Supervisor ID:</strong> {selectedRequest.supervisor_ID}</p>
                        <p><strong>Leave Type:</strong> {selectedRequest.leave_type}</p>
                        <p>
                            <span
                                className={`px-2 py-1 rounded-full text-white ${selectedRequest.status === 1
                                    ? 'bg-green-500' // Approved
                                    : selectedRequest.status === 2
                                        ? 'bg-red-500' // Rejected
                                        : ' bg-yellow-500' // Pending (or other statuses)
                                    }`}
                            >
                                {selectedRequest.status === 1
                                    ? 'Approved'
                                    : selectedRequest.status === 2
                                        ? ' Rejected'
                                        : 'Pending'}
                            </span>
                        </p>

                        <button onClick={handleCloseDetails} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestHistory;
