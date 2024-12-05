import React, { useState, useRef, useEffect } from 'react';
import { FaKey, FaBell, FaSignOutAlt } from 'react-icons/fa';
import backgroundImage from '../assets/Home.png';
import logoImage from '../assets/logo.png';
import axios from 'axios';
import LogoutPopup from './LogOut'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    BellOutlined,
    DownloadOutlined,
    LogoutOutlined, DashboardOutlined, FileAddOutlined, HistoryOutlined
} from '@ant-design/icons'; // Ant Design icons

const trainee_id = sessionStorage.getItem('Trainee ID'); // Fallback for missing username

function Profile() {

    const avatarInputRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [trainee_ID, setTraineeID] = useState('');
    const [leave_count, setLeaveCount] = useState('');
    const [nic, setNIC] = useState('');
    const [trainee_name,setTraineeName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [image, setImage] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    var id = 0;


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogoutClick = () => {
        setShowPopup(true); // Show the popup
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Hide the popup
    };

    const handleLogout = () => {
        // Remove the session variable
        sessionStorage.removeItem('username');
        // Navigate to the login page
        navigate('/');
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(file);
                setAvatar(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setImage(file);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('Username', username);
        formData.append('Password', password);
        formData.append('image', image);

        try {
            await axios.put(`https://imsearlyleaveserver.azurewebsites.net/updateUser?trainee_ID=${trainee_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                alert(`Server error: ${error.response.status} - ${error.response.data.message || 'Profile update failed.'}`);
            } else if (error.request) {
                alert('No response from server. Please check your connection.');
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    };

    useEffect(() => {

        const fetchData = async () => {
           
            try {
         
                // Fetch user profile data
                const response = await axios.get(`https://imsearlyleaveserver.azurewebsites.net/UserById?trainee_id=${trainee_id}`);
                const { username, password, trainee_ID, trainee_Name, nic, leave_Count, image } = response.data;

                // Set the form fields
                setUsername(username);
                setPassword(password);
                setNIC(nic);
                setTraineeID(trainee_ID);
                setLeaveCount(leave_Count);
                setTraineeName(trainee_Name);


                // If there's an image, convert it to a base64 data URL
                if (image) {
                    const base64Image = `data:image/png;base64,${image}`;
                    setAvatar(base64Image);
                    sessionStorage.setItem("ImageBase64",avatar);
                }
            } catch (error) {
                console.error('Error fetching user profile data:', error);
            }

        };
        fetchData();
    }, []);

 
      return (

            <div className="bg-gray-100 font-sans min-h-screen flex">
              <nav className="bg-gradient-to-r from-green-400 to-blue-600 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                  <div className="container mx-auto flex items-center justify-between p-4">
                      <div className="ml-[5vh]">
                          <a href="/Dashboard" className="text-white text-2xl font-bold">Early Leave</a>
                      </div>

                      <div className="flex items-center">
                          <ul className="md:flex text-white items-center">
                              <a href="/Profile">
                                  <li className="mr-6 flex items-center cursor-pointer hover:text-black transition duration-300">
                                      <img
                                          id="avatarImage"
                                          src={avatar}
                                          alt="Profile"
                                          className="w-[50px] h-[50px] rounded-full object-cover mr-2"
                                      />
                                      <span>{trainee_id}</span>
                                  </li>
                              </a>
                              <li>
                                  <a className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center" onClick={handleLogoutClick}>
                                      <FaSignOutAlt className="h-5 w-5 mr-2" />
                                      <span className="mr-3">Logout</span>
                                  </a>
                              </li>
                              <li className="relative">
                                  <button
                                      className="cursor-pointer text-white hover:text-black transition duration-300 flex items-center px-2"
                                      onClick={toggleDropdown}
                                  >
                                      <FaBell className="h-5 w-5 text-white mr-3" />

                                  </button>
                                  {isDropdownOpen && (
                                      <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                                          <div className="p-2 border-b">
                                              <span className="font-bold">Notifications</span>
                                          </div>
                                          <ul>
                                              <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 1</li>
                                              <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 2</li>
                                              <li className="p-2 hover:bg-gray-200 cursor-pointer">Notification 3</li>
                                          </ul>
                                      </div>
                                  )}
                              </li>
                          </ul>
                      </div>
                  </div>
              </nav>
                {/* Sidebar */}
              <aside className="bg-gradient-to-b from-green-400 to-blue-600 text-white transition-all duration-300 ease-in-out shadow-2xl h-[100vh] px-8 py-20" style={{

                  position: 'sticky',
                  top: '0',

              }}>
                  <img src={logoImage} className="w-[150px] absolute" alt="Logo" />

                  <nav>
                      <ul className="space-y-6 mb-6 py-20 mt-[9vh]">
                          <li>
                              <a href="/Dashboard" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                  <DashboardOutlined className="h-6 w-6 mr-3" />
                                  <span className="font-medium">Dashboard</span>
                              </a>
                          </li>
                          <li>
                              <a href="/AddRequest" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                  <FileAddOutlined className="h-6 w-6 mr-3" />
                                  <span className="font-medium">Request Leave</span>
                              </a>
                          </li>
                          <li>
                              <a href="/Requests" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                  <HistoryOutlined className="h-6 w-6 mr-3" />
                                  <span className="font-medium">Leave History</span>
                              </a>
                          </li>
                          <li>
                              <a href="/Profile" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                  <UserOutlined className="h-6 w-6 mr-3" />
                                  <span className="font-medium">Profile</span>
                              </a>
                          </li>
                          <li>
                              <a href="/Download" className="flex items-center py-2 px-4 text-white rounded-md hover:bg-white hover:text-green-500 transition duration-300 ease-in-out">
                                  <DownloadOutlined className="h-6 w-6 mr-3" />
                                  <span className="font-medium">Permissions</span>
                              </a>
                          </li>
                          <li>
                              <div className="mt-auto">
                                  <a

                                      className="flex items-center px-6 py-3 cursor-pointer hover:bg-red-600 rounded-md transition-all duration-200 ease-in-out"
                                      onClick={(e) => {
                                          e.preventDefault(); // Prevent default anchor click behavior
                                          handleLogoutClick(); // Call the function
                                      }}
                                  >
                                      <LogoutOutlined className="h-6 w-6 ml-2" />
                                      <span className="ml-3 nav-text text-lg font-medium text-white">Logout</span>
                                  </a>
                              </div>
                          </li>
                      </ul>

                      <LogoutPopup
                          show={showPopup}
                          onClose={handleClosePopup}
                          onLogout={handleLogout}
                      />
                  </nav>
              </aside>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 flex-1 bg-black w-[170vh] min-h-screen p-32" style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
              }}>
                  
                  <div className="bg-gradient-to-b from-blue-800 to-green-500 rounded-lg shadow-md p-6 lg:p-12 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">My Profile</h2>
                      <form  onSubmit={handleSubmit}>
                        <div className="flex lg:flex-row flex-col lg:space-x-12  ">
                            {/* Avatar Section */}
                            <div className="lg:w-1/3 text-center">
                                <div
                                    className="relative w-48 h-48 rounded-full mx-auto overflow-hidden mb-6"
                                    style={{ backgroundColor: 'rgba(204, 204, 204, 0.2)' }}
                                >
                                    <img
                                        id="avatarImage"
                                        src={avatar}
                                        alt="Avatar"
                                          className="font-bold text-white  w-full h-full  "
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 cursor-pointer"
                                    >
                                        <span className="text-white font-bold">Change Avatar</span>
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    ref={avatarInputRef}
                                />
                            </div>

                            {/* Profile Info Section */}
                            <div className="lg:w-2/3 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-white font-bold mb-2">Username:</label>
                                    <input
                                        type="text"
                                      id="username"
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                      <label htmlFor="name" className="block text-white font-bold mb-2">Name:</label>
                                      <input
                                          type="text"
                                          id="name"
                                          value={trainee_name}
                                          disabled
                                          onChange={(e) => setTraineeName(e.target.value)}
                                          className="font-bold text-white w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                  </div>
                                <div>
                                      <label htmlFor="email" className="block text-white font-bold mb-2">Password:</label>
                                    <input
                                        type="text"
                                      id="password"
                                      value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          
                                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>
                              <div>
                                      <label htmlFor="email" className="block text-white font-bold mb-2">Trainee ID:</label>
                                  <input
                                      type="number"
                                      id="trainee_ID"
                                      value={trainee_ID}
                                          onChange={(e) => setTraineeID(e.target.value)}
                                          disabled
                                          className="font-bold text-white w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
                                  <div>
                                      <label htmlFor="email" className="block text-white font-bold mb-2">NIC:</label>
                                      <input
                                          type="text"
                                          id="nic"
                                          value={nic}
                                          disabled
                                          onChange={(e) => setNIC(e.target.value)}
                                          className="font-bold text-white w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                  </div>
                                  <div>
                                      <label htmlFor="email" className="block text-white font-bold mb-2">Leave Count:</label>
                                      <input
                                          type="text"
                                          id="leave_count"
                                          value={leave_count}
                                          onChange={(e) => setNIC(e.target.value)}
                                          disabled
                                          className="font-bold text-white w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                  </div>
                                <button
                                    type="submit"
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                  </form>
                        <hr className="my-10 border-t border-gray-200" />

                        {/* Additional Settings */}
                      <div className="space-y-4">
                            <div className="flex items-center">
                              <FaKey className="h-6 w-6 text-white mr-3" />
                              <a href="#" className="text-blue-500 hover:underline font-medium text-white">Change Password</a>
                            </div>
                            <div className="flex items-center">
                              <FaBell className="h-6 w-6 text-white mr-3" />
                              <span className="font-medium text-white">Notifications:</span>
                                <label htmlFor="email-notifications" className="ml-2">
                                    <input
                                        type="checkbox"
                                        id="email-notifications"
                                        className="text-whiterounded-md border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        defaultChecked
                                    />
                                  <span className="ml-1 text-white">Email</span>
                                </label>
                            </div>
                        </div>
                    </div>
              </div>
          
            </div>
        );
    }
export default Profile;
