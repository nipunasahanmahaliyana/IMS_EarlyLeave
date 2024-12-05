import React, { useState } from 'react';
import { gsap } from "gsap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/Home.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [trainee_id, setTraineeID] = useState('');
    const [service_id, setServiceID] = useState('');
    const navigate = useNavigate();
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.get(`https://imsearlyleaveserver.azurewebsites.net/Login?username=${username}&password=${password}`)
            .then(response => {
                // Check if the response indicates a successful login
                if ( response.data) {
                    setTraineeID(response.data);
                    alert("Login Successful!");

                } else {
                    alert("Login Failed!");
                }
            })
            .catch(error => {
                    console.error('Error fetching data:', error);
                    alert("Server Error. Please try again later.");
            });
    };

    sessionStorage.setItem('Trainee ID', trainee_id);
    sessionStorage.setItem('Service_ID', service_id);

    const handleAdminSubmit = (event) => {
        event.preventDefault();

        axios.get(`https://imsearlyleaveserver.azurewebsites.net/Adminlogin?username=${username}&password=${password}`)
            .then(response => {
                // Check if the response indicates a successful login
                if (response.status === 200 && response.data) {
                    setServiceID(response.data);
                    alert("Login Successful!");
                } else {
                    alert("Login Failed!");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert("Server Error. Please try again later.");
            });
    };


    React.useEffect(() => {
        gsap.fromTo(".login-box", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power4.out" });
        gsap.fromTo(".login-header", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 });
        gsap.fromTo(".login-button", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out", delay: 0.6 });
    }, []);

    if (trainee_id != 0) {
        navigate("/Home");
    }

    if (service_id != 0) {
        navigate("/AdminDashboard");
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75"></div>

            {!isAdminLogin ? (

                <div className="relative z-10 max-w-md w-full space-y-8 login-box p-8 bg-white bg-opacity-90 rounded-2xl shadow-xl transform transition-transform duration-300">
                    <div>
                        <h2 className="login-header text-center text-4xl font-bold text-gray-800">
                            Welcome Back!
                        </h2>
                        <p className="text-center text-sm text-gray-500 mt-2">Please login to your account</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="text"
                                    required
                                    className="appearance-none rounded-full block w-full px-5 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out sm:text-sm"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-full block w-full px-5 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="login-button group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-lg transform hover:-translate-y-1"
                            >
                                Sign In
                            </button>
                        </div>
                        <h2 onClick={() => setIsAdminLogin(true)} className="text-center mt-5 text-red-800 text-sm italic cursor-pointer">*Admin login</h2>
                    </form>
                </div>
            ) : (
                    <div className="relative z-10 max-w-md w-full space-y-8 login-box p-8 bg-white bg-opacity-90 rounded-2xl shadow-xl transform transition-transform duration-300">
                        <div>
                            <h2 className="login-header text-center text-4xl font-bold text-gray-800">
                                Welcome Back!
                            </h2>
                            <p className="text-center text-sm text-gray-500 mt-2">Login as Admin</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleAdminSubmit}>
                            <div className="rounded-md shadow-sm space-y-4">
                                <div>
                                    <label htmlFor="username" className="sr-only">Service Number</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="text"
                                        required
                                        className="appearance-none rounded-full block w-full px-5 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out sm:text-sm"
                                        placeholder="Service number"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-full block w-full px-5 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="login-button group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-lg transform hover:-translate-y-1"
                                >
                                    Sign In
                                </button>
                            </div>
                            <h2 onClick={() => setIsAdminLogin(false)} className="text-center mt-5 text-red-800 text-sm italic cursor-pointer">*User login</h2>
                            <a href="/Register"><h2 className="text-center mt-1 text-red-800 text-sm italic cursor-pointer">*Register as Admin</h2></a>
                        </form>
                    </div>
            )};
        </div>
    );
}

export default Login;
