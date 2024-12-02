import { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Input, Form, Row, Col, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import gsap from 'gsap';
import axios from 'axios';
import logoImage from "/src/assets/logo.png";
import {
    UsergroupAddOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'; // Ant Design icons
import { FaSignOutAlt} from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(3); // Number of users per page
    const tableRef = useRef();
    const [loading, setLoading] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [trainee_id,setTraineeID] = useState(""); // Ensure correct format as expected by the backend
    const [nic, setNic] = useState("");
    const [name, setName] = useState("");
    const [supervisorId, setSupervisorId] = useState("");
    const [count, setLeaveCount] = useState("");
    const [image, setImage] = useState("");
    const avatarInputRef = useRef(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const [showPopup, setShowPopup] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        traineeId: "",
        nic: "",
        traineeName: "",
    });

    const service_id = sessionStorage.getItem('Service_ID');

    const getLeaveData = async () => {
        setSupervisorId(service_id);
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:7247/AssigendSupervisorforTrainees?supervisor_id=${service_id}`);

            if (response.status === 200) {
                console.log('Leave data retrieved successfully:', response.data);
                setUsers(response.data);
            } else {
                console.error('Error retrieving leave data:', response.data);
            }


        } catch (error) {
            console.error('Error fetching leave data:', error.message);
        } finally {
            setLoading(false);
        }
    };



    const handleLogoutClick = () => {
        setShowPopup(true); // Show the popup
    };

    const handleLogout = () => {
        // Remove the session variable
        sessionStorage.removeItem('username');
        // Navigate to the login page
        navigate('/');
    };



    const addUser = async () => {
        try {
            // Prepare form data
            var formData = new FormData();
            formData.append("Username", username);
            formData.append("Password", password);
            formData.append("Trainee_ID", trainee_id);
            formData.append("NIC", nic);
            formData.append("Name", name);
            formData.append("Supervisor_ID", service_id);
            

            var formData1 = new FormData();
            formData.append("Image", avatarInputRef.current.files[0]); // Add the image

            // Print the form data
            console.log("FormData contents:");
            formData.forEach((value, key) => {
                console.log(key + ": " + value);
            });
            console.log(image);
            // Send Axios request
            const response = await axios.post('https://localhost:7247/AddUsers', formData, formData1, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('User added successfully:', response.data);
            return response.data;
        } catch (error) {
                       
                alert(`Error: ${error.message}`);
           
        }
    };

  
    useEffect(() => {
        gsap.fromTo(tableRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        getLeaveData();
    }, []);

    const showModal = (user = null) => {
        setEditingUser(user);
        setIsModalVisible(true);
        gsap.fromTo(".ant-modal-content", { scale: 0 }, { scale: 1, duration: 0.3 });
    };

    const showAddModal = () => {
        
        setIsAddModalVisible(true);
        gsap.fromTo(".ant-modal-content", { scale: 0 }, { scale: 1, duration: 0.3 });
    };

    const handleOk = (values) => {
        if (editingUser) {
            setUsers(users.map(user => (user.Trainee_ID === editingUser.Trainee_ID ? { ...user, ...values } : user)));
        } else {
            setUsers([...users, { ...values, Trainee_ID: users.length + 1 }]);
        }
        setIsModalVisible(false);
    };

    const handleDelete = () => {
        
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

    return (
        <div className="min-h-screen overflow-x-hidden">
            <nav className="bg-gradient-to-r from-blue-900 to-purple-800 text-white shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out">
                <div className="container mx-auto flex items-center justify-between p-4 ">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full mr-3 transition-transform transform hover:scale-110" />
                        <a href="/AdminDashboard" className="text-3xl font-extrabold tracking-wide hover:text-blue-300 transition duration-300">
                            Early Leave
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/ManageUsers" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <UsergroupAddOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Manage Users</span>
                        </a>
                        <a href="/Report" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <FileTextOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Reports</span>
                        </a>
                        <a href="/History" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <HistoryOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">History</span>
                        </a>
                        <a href="/Approve" className="flex items-center hover:text-yellow-400 transition duration-300 ease-in-out">
                            <CheckCircleOutlined className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Approve</span>
                        </a>

                    </div>

                    {/* Avatar and Notifications */}
                    <div className="relative flex items-center">
                        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
                            <span className="text-white font-semibold">Menu</span>
                        </button>
                        <div className="hidden md:flex flex-row mr-4 items-center space-x-2">
                            <a href="/Profile" className="flex items-center hover:text-blue-300 transition duration-300">
                                <img
                                    id="avatarImage"
                                    src="data:image/jpeg;base64,@Model.imageBase64"
                                    className="w-10 h-10 rounded-full object-cover hover:scale-110 transition-transform duration-200"
                                />
                                <span className="ml-2 text-sm font-semibold">{service_id}</span>
                            </a>
                        </div>


                        <button className="cursor-pointer text-white hover:text-yellow-400 transition duration-300 flex items-center mr-4" onClick={handleLogoutClick}>
                            <FaSignOutAlt className="h-5 w-5 ml-2 mr-2" />
                        </button>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white text-black shadow-lg transition-all duration-300 ease-in-out">
                        <div className="flex flex-col p-4">
                            <a href="/AddRequest" className="py-2 hover:bg-gray-200 transition-colors duration-200">Request Leave</a>
                            <a href="/Requests" className="py-2 hover:bg-gray-200 transition-colors duration-200">Leave History</a>
                            <a href="/Profile" className="py-2 hover:bg-gray-200 transition-colors duration-200">Profile</a>
                            <a href="/Notification" className="py-2 hover:bg-gray-200 transition-colors duration-200">Notifications</a>
                            <a href="/Download" className="py-2 hover:bg-gray-200 transition-colors duration-200">Permissions</a>
                            <a href="/Approve" className="py-2 hover:bg-gray-200 transition-colors duration-200">Approval</a>
                            <div className="mt-4">
                                <button className="w-full text-left py-2 hover:bg-gray-200 transition-colors duration-200" onClick={handleLogoutClick}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </nav>

            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 min-h-screen mt-[10vh] w-full">
                <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 text-white p-6">Manage Users</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                        onClick={() => showAddModal()}
                    className="bg-black hover:bg-green-600 transition duration-300 mr-[10vh]"
                >
                    Add User
                </Button>
            </div>

            {/* Search Bar */}
            <div className="w-[50vh] p-5">
                <Input
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="rounded-lg border-gray-300 focus:border-blue-500"
                />
            </div>

                <Row gutter={16} ref={tableRef} className="p-5">
                {users.length > 0 ? (
                    users.map(user => (
                        <Col span={8} key={user.trainee_ID}>
                            <Card className="mb-4 hover:shadow-lg transition duration-300">
                                <img
                                    src={`data:image/png;base64,${user.image}`}
                                    alt="User"
                                    className="w-24 h-24 rounded-full mx-auto"
                                />

                                <h3 className="text-xl font-bold text-center mt-2">{user.trainee_ID}</h3>
                                <p className="text-center text-gray-600">Supervisor ID: {user.assigned_Supervisor_ID}</p>
                                
                                <div className="flex justify-center mt-4 space-x-2">
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => showModal(user)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                      
                                        onClick={() => handleDelete()}
                                        className="bg-red-500 hover:bg-red-600 text-white transition duration-300"
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <div className="w-full text-center text-gray-500">No users found.</div>
                )}
            </Row>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                onChange={page => setCurrentPage(page)}
                className="mt-4 "
            />

            <Modal
                title="Edit User"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                className="rounded-lg shadow-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form onFinish={handleOk} layout="vertical">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Column 1 */}
                            <Form.Item
                                name="Username"
                                    label="Username"
                                    initialValue={''}
                                rules={[{ required: true, message: 'Please input the username!' }]}
                            >
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                            <Form.Item
                                name="Password"
                                label="Password"
                                initialValue={editingUser ? editingUser.Password : ''}
                                rules={[{ required: true, message: 'Please input the password!' }]}
                            >
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                            <Form.Item
                                name="Trainee_Id"
                                    label="Trainee ID"
                                    initialValue={editingUser ? editingUser.Trainee_ID : ''}
                                rules={[{ required: true, message: 'Please input the Trainee ID!' }]}
                            >
                                <Input
                                    value={trainee_id}
                                    onChange={(e) => setTraineeID(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                            <Form.Item
                                name="NIC"
                                label="NIC"
                                initialValue={editingUser ? editingUser.NIC : ''}
                                rules={[{ required: true, message: 'Please input the NIC!' }]}
                            >
                                <Input
                                    value={nic}
                                    onChange={(e) => setNic(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Column 2 */}
                            <Form.Item
                                name="Trainee_Name"
                                label="Trainee Name"
                                initialValue={editingUser ? editingUser.Trainee_Name : ''}
                                rules={[{ required: true, message: 'Please input the trainee name!' }]}
                            >
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                            <Form.Item
                                name="Supervisor_ID"
                                    label="Supervisor ID"
                                    initialValue={service_id}
                            >
                                <Input
                                    value={supervisorId}
                                    onChange={(e) => setSupervisorId(e.target.value)}
                                    disabled
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>
                            <Form.Item
                                name="Leave_Count"
                                label="Leave Count"
                                initialValue={editingUser ? editingUser.Leave_Count : 0}
                                rules={[{ required: true, message: 'Please input the leave count!' }]}
                            >
                                <Input
                                    value={count}
                                    onChange={(e) => setLeaveCount(e.target.value)}
                                    type="number"
                                    className="border-gray-300 focus:border-blue-500"
                                />
                            </Form.Item>

                            <img
                                id="avatarImage"
                                src={avatar}
                                alt="Avatar"
                                className="font-bold text-white w-[20vh] h-[20vh]"
                            />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                ref={avatarInputRef}
                            />
                        </div>

                        <Form.Item className="col-span-2">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-blue-500 hover:bg-blue-600 transition duration-300 w-full"
                                onClick={addUser}
                            >
                                 Update User
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                </Modal>

                <Modal
                    title="Add Trainee"
                    visible={isAddModalVisible}
                    onCancel={() => setIsAddModalVisible(false)}
                    footer={null}
                    className="rounded-lg shadow-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form onFinish={handleOk} layout="vertical">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Username */}
                                <Form.Item
                                    name="Username"
                                    label="Username"
                                    rules={[{ required: true, message: 'Please input the username!' }]}
                                >
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </Form.Item>

                                {/* Password */}
                                <Form.Item
                                    name="Password"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please input the password!' }]}
                                >
                                    <Input.Password
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </Form.Item>

                                {/* Trainee ID */}
                                <Form.Item
                                    name="Trainee_Id"
                                    label="Trainee ID"
                                    rules={[{ required: true, message: 'Please input the Trainee ID!' }]}
                                >
                                    <Input
                                        value={trainee_id}
                                        onChange={(e) => setTraineeID(e.target.value)}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </Form.Item>

                                {/* Supervisor ID */}
                                <Form.Item
                                    name="supervisor_id"
                                    label="Supervisor ID"
                                    initialValue={service_id}
                                    
                                >
                                    <Input
                                        className="border-gray-300 focus:border-blue-500"
                                        disabled
                                    />
                                </Form.Item>

                                {/* NIC */}
                                <Form.Item
                                    name="NIC"
                                    label="NIC"
                                    rules={[{ required: true, message: 'Please input the NIC!' }]}
                                >
                                    <Input
                                        value={nic}
                                        onChange={(e) => setNic(e.target.value)}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </Form.Item>

                                {/* Trainee Name */}
                                <Form.Item
                                    name="Trainee_Name"
                                    label="Trainee Name"
                                    rules={[{ required: true, message: 'Please input the trainee name!' }]}
                                >
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </Form.Item>

                                {/* Image Upload */}
                                <Form.Item label="Avatar">
                                    <img
                                        id="avatarImage"
                                        src={avatar || 'https://via.placeholder.com/150'}
                                        alt="Avatar"
                                        className="font-bold text-white w-[20vh] h-[20vh] mb-2"
                                    />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        ref={avatarInputRef}
                                    />
                            
                                </Form.Item>
                            </div>

                            {/* Submit Button */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-500 hover:bg-blue-600 transition duration-300 w-full"
                                    onClick={addUser}
                                >
                                    Add User
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>

                </Modal>
            </div>
        </div>
    );
};

export default ManageUsers;
