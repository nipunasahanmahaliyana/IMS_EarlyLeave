import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import backgroundImage from '../assets/Home.png';

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // Basic form validation
        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password match validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Success
        console.log("Name:", name, "Email:", email, "Password:", password);
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
        <div
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="max-w-md w-full space-y-8 registration-box p-8 bg-gradient-to-r from-green-400 to-blue-600 rounded-lg shadow-lg text-white">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">Create your account</h2>
                </div>
                {error && (
                    <div className="bg-red-500 text-white py-2 px-4 rounded-lg text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="name" className="text-sm font-medium absolute left-3 -top-2 bg-gray-900 px-2  rounded-full">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="w-full px-2 py-4 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Enter the name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="email" className="text-sm font-medium absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="text-sm font-medium absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
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
                        <label htmlFor="confirmPassword" className="text-sm font-medium absolute left-3 -top-2 bg-gray-900 px-2 rounded-full">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="w-full px-4 py-3 bg-transparent border-b border-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-white text-sm5"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300 ease-out"
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
