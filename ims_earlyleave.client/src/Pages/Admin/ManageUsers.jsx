import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Input, Form, Row, Col, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import gsap from 'gsap';
import axios from 'axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
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

    const getLeaveData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:7247/AssigendSupervisorforTrainees?supervisor_id=19559`);

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



    // Usage example
    const userData = {
        Username: 'johndoe',
        Password: 'password123',
        Trainee_ID: 123,
        NIC: '123456789V',
        Trainee_Name: 'John Doe',
        Leave_Count: 2,
        Supervisor_ID: 456
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
            formData.append("Supervisor_ID", 19559);
            //formData.append("LeaveCount", count);

            // Attach the image file if it exists
            if (image) {
                formData.append('image', image);
            }

            // Print the form data
            console.log("FormData contents:");
            formData.forEach((value, key) => {
                console.log(key + ": " + value);
            });

            // Send Axios request
            const response = await axios.post('https://localhost:7247/AddUsers', formData,image, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('User added successfully:', response.data);
            return response.data;
        } catch (error) {
            // Error handling
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                alert(`Error -: ${error.response.data.message || 'Failed to add user'}`);
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                alert('Network error: No response received');
            } else {
                // Other errors
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }
            return null;
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
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    className="bg-green-500 hover:bg-green-600 transition duration-300"
                >
                    Add User
                </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <Input
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="rounded-lg border-gray-300 focus:border-blue-500"
                />
            </div>

            <Row gutter={16} ref={tableRef}>
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
                className="mt-4"
            />

            <Modal
                title={editingUser ? "Edit User" : "Add User"}
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
                                initialValue={editingUser ? editingUser.Username : ''}
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
                                initialValue={editingUser ? editingUser.NIC : ''}
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
                                initialValue={editingUser ? editingUser.Trainee_Name : ''}
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
                                {editingUser ? "Update" : "Add"} User
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </Modal>
        </div>
    );
};

export default ManageUsers;
