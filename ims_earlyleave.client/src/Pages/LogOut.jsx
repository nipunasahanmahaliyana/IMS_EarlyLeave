import React from 'react';

function LogoutPopup({ show, onClose, onLogout }) {
    if (!show) return null; // Don't render if `show` is false

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-0">
            <div className="bg-gradient-to-b from-blue-800 to-green-500 p-6 rounded-lg shadow-lg w-80 text-center w-[49vh]">
                <h2 className="text-xl font-semibold mb-4 ">Are you sure you want to log out?</h2>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutPopup;
