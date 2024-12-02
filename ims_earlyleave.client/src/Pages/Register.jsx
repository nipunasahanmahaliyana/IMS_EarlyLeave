import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import backgroundImage from '../assets/Home.png';

const Registration = () => {
    const [id, setid] = useState('');
    const [name, setName] = useState('');
    const [designation, setdesignation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // Basic form validation
        if (!name || !designation || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Password match validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Success
        console.log("Id:",id, "Name:", name, "Designation:", designation, "Password:", password);
    };

    useEffect(() => {
        // GSAP animation on component mount
        gsap.fromTo(
            '.registration-box',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        );
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75"></div>
            <div className="relative z-10 max-w-md w-full space-y-8 login-box p-8 bg-grey bg-opacity-90 rounded-2xl shadow-2xl transform transition-transform duration-300">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-black">Create your account</h2>
                </div>
                {error && (
                    <div className="bg-red-500 text-white py-2 px-4 rounded-lg text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="name" className="text-sm font-medium text-white absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Service ID
                        </label>
                        <input
                            id="id"
                            name="id"
                            type="number"
                            autoComplete="id"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Enter the service number"
                            value={id}
                            onChange={(e) => setid(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="name" className="text-sm font-medium text-white absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Enter the name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="email" className="text-sm font-medium text-white absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Designation
                        </label>
                        <input
                            id="designation"
                            name="designation"
                            type="text"
                            autoComplete="designaation"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Enter desgination"
                            value={designation}
                            onChange={(e) => setdesignation(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="text-sm font-medium text-white absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-white absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="w-full text-sm px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white "
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gray-700 text-white font-semibold text-white rounded-md hover:bg-gray-600 transition duration-300 ease-out"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;


