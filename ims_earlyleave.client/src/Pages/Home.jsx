import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import 'animate.css';
import logoImage from '../assets/SLT-LOGO.png';
import image from '../assets/logo.png';


const user = sessionStorage.getItem('Trainee ID');
import { UserOutlined } from '@ant-design/icons'; // Importing Ant Design User icon

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    //const [trainee_id, setTraineeID] = useState();
    // Preloader logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Simulate a loading time of 1 second
        return () => clearTimeout(timer);
    }, []);

    // GSAP animation for hero section
    useEffect(() => {
        if (!isLoading) {
            gsap.from('.hero-text', { opacity: 0, y: 50, duration: 1, ease: 'power2.out', delay: 0.5 });
            gsap.from('.hero-subtext', { opacity: 0, y: 50, duration: 1, ease: 'power2.out', delay: 0.8 });
            gsap.from('.btn-home', { opacity: 0, scale: 0.9, duration: 1, ease: 'power2.out', delay: 1.2 });
            gsap.from('.countdown-item', { opacity: 0, scale: 0.8, duration: 1, stagger: 0.2, delay: 1.5 });
        }
    }, [isLoading]);

    const [timeSpent, setTimeSpent] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeSpent = () => {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of the current year

            // Time difference in milliseconds
            const diff = now - startOfYear;

            // Convert milliseconds to various units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            // Set the state with the calculated time
            setTimeSpent({ days, hours, minutes, seconds });
        };

        // Update every second
        const intervalId = setInterval(calculateTimeSpent, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-gray-100 text-gray-800 ">
            {/* Preloader */}
            {isLoading && (
                <div id="preloader" className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <div className="animate-spin h-12 w-12 border-t-4 border-blue-600 rounded-full"></div>
                </div>
            )}

            <div className="bg-gradient-to-r from-green-500 to-blue-600 flex flex-row justify-end items-center py-4">
                <div className="bg-white flex justify-center rounded-[20vh] w-[30vh] h-[10vh]">
                    <img className="w-[10vh] h-[10vh] " src={logoImage}></img>
                </div>
            <div className="flex flex-row items-center text-white px-6 py-4 text-lg">
                <UserOutlined style={{ fontSize: '24px', color: 'white', marginRight: '10px' }} />
                <h1>{user}</h1>
            </div>
            </div>

            {/* Hero Section */}
            <section id="hero-area" className="mt-[-14.5vh]  flex items-center justify-center h-screen bg-gradient-to-r from-green-500 to-blue-600 text-white">
               
                <div className="ml-[10vh] container mx-auto px-4 flex flex-col md:flex-row items-center">
                    
                    <div className="md:w-1/2 ">
                        <div className="bg-white flex justify-center rounded-[20vh] w-[30vh] h-[10vh] mb-2">
                            <img className="w-[10vh] h-[10vh] "src={logoImage}></img>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text">SLT Mobitel Early Leave</h1>
                        <p className="text-lg mb-8 hero-subtext">

                            Here’s a professional and friendly welcome text for your Early Leave System:

                            Welcome to the Early Leave Management System
                            Effortlessly manage, track, and process early leave requests with our streamlined platform. Designed for supervisors and trainees, this system ensures efficient communication, quick approvals, and transparency.

                            Let’s make leave management simpler and more effective together!
                        </p>
                        <a href="/Dashboard" className="px-6 py-3 border-grey-400 cusrsor:pointer text-blue-600 rounded-lg shadow hover:bg-blue-400 transition text-white">
                            Get Started
                        </a>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0">
                        <div className="text-center">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="countdown-item">
                                    <div className="text-6xl font-bold">{timeSpent.days}</div>
                                    <span className="block mt-2 text-xl">Days</span>
                                </div>
                                <div className="countdown-item">
                                    <div className="text-6xl font-bold">{timeSpent.hours}</div>
                                    <span className="block mt-2 text-xl">Hours</span>
                                </div>
                                <div className="countdown-item">
                                    <div className="text-6xl font-bold">{timeSpent.minutes}</div>
                                    <span className="block mt-2 text-xl">Minutes</span>
                                </div>
                                <div className="countdown-item">
                                    <div className="text-6xl font-bold">{timeSpent.seconds}</div>
                                    <span className="block mt-2 text-xl">Seconds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default App;
