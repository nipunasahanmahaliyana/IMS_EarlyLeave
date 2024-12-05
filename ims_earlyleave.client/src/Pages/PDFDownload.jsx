/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Notifications from './Notifications';

const trainee_id = sessionStorage.getItem('Trainee ID') || "Guest"; // Fallback for missing username

function PDFDownload() {
    const [isOpen, setIsOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch approved requests from the .NET API
    const fetchApprovedRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://imsearlyleaveserver.azurewebsites.net/ApprovedRequests?trainee_id=${trainee_id}`); // Replace '1' with dynamic trainee_id
            const data = await response.json();
            setRequests(data); // Set the fetched requests in state
        } catch (err) {
            setError('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    // Fetch PDF for a specific request ID from the .NET API
    const PDFReq = async (id) => {
        try {
            setLoading(true);

            const response = await fetch(`https://imsearlyleaveserver.azurewebsites.net/GenerateLeaveRequestPDF?id=${id}`);

            // Handle errors
            if (!response.ok) {
                throw new Error('Failed to fetch PDF for request ID: ' + id);
            }

            // Read the response as a blob (binary data)
            const blob = await response.blob();

            // Create a URL for the PDF blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Leave Request-${id}.pdf`; // Set the filename for the download
            document.body.appendChild(a); // Append the link to the body
            a.click(); // Programmatically click the link to trigger download
            a.remove(); // Remove the link from the document

        } catch (err) {
            //setError(`Failed to fetch PDF for request ID: ${id}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    // Button to trigger PDF download for a specific request ID
    const PDFrequests = ({ id }) => {
        const handleDownload = async () => {
            await PDFReq(id); // Call the PDFReq function with the request ID
        };

        return (
            <button onClick={handleDownload}>Download PDF for {id}</button>
        );
    };

    // Handle div click to fetch and toggle the list
    const handleClick = () => {
        if (!isOpen) {
            fetchApprovedRequests(); // Fetch requests only when opening the list
          
        }
        setIsOpen(!isOpen); // Toggle visibility
    };

    return (
        <div className="p-4">
            {/* Notification div */}
            <div
                onClick={handleClick}
                className="cursor-pointer"
            >
                <Notifications count={requests.length} />
            </div>

            {/* Conditional rendering of the request list */}
            {isOpen && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'
                    } mt-4 bg-white p-4 border border-gray-300 rounded`}>

                    <h3 className="font-semibold text-lg mb-2">Approved Requests</h3>

                    {/* Show loading state */}
                    {loading && <p>Loading...</p>}

                    {/* Show error if there is an error */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Show approved requests */}
                    <ul>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                // In your request rendering list
                                <li key={request.id} className="mb-2 text-black">
                                    <strong>{request.id}</strong> - Date: {new Date(request.date).toLocaleDateString()}, Status: {request.status},
                                    Download: <PDFrequests id={request.id} />
                                </li>
                            ))
                        ) : (
                            !loading && <p>No approved requests found</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PDFDownload;
