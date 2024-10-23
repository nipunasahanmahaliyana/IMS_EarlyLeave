import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Input, Form, Row, Col, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import gsap from 'gsap';

const ManageUsers = () => {
    const [users, setUsers] = useState([
        { Username: 'johnDoe', Password: 'password123', Trainee_ID: 1, NIC: '123456789V', Trainee_Name: 'John Doe', Leave_Count: 2, Image: 'https://via.placeholder.com/150' },
        { Username: 'janeDoe', Password: 'password456', Trainee_ID: 2, NIC: '987654321V', Trainee_Name: 'Jane Doe', Leave_Count: 5, Image: 'https://via.placeholder.com/150' },
        { Username: 'samSmith', Password: 'password789', Trainee_ID: 3, NIC: '543216789V', Trainee_Name: 'Sam Smith', Leave_Count: 3, Image: 'https://via.placeholder.com/150' },
        // Add more example data as needed
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(3); // Number of users per page
    const tableRef = useRef();

    useEffect(() => {
        gsap.fromTo(tableRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
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

    const handleDelete = (Trainee_ID) => {
        setUsers(users.filter(user => user.Trainee_ID !== Trainee_ID));
    };

    const filteredUsers = users.filter(user => user.Username.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalUsers = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
                        <Col span={8} key={user.Trainee_ID}>
                            <Card className="mb-4 hover:shadow-lg transition duration-300">
                                <img src={user.Image} alt="User" className="w-24 h-24 rounded-full mx-auto" />
                                <h3 className="text-xl font-bold text-center mt-2">{user.Trainee_Name}</h3>
                                <p className="text-center text-gray-600">Username: {user.Username}</p>
                                <p className="text-center text-gray-600">Leave Count: {user.Leave_Count}</p>
                                <div className="flex justify-center mt-4 space-x-2">
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => showModal(user)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        onClick={() => handleDelete(user.Trainee_ID)}
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
                total={totalUsers}
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
                <Form onFinish={handleOk} layout="vertical">
                    <Form.Item name="Username" label="Username" initialValue={editingUser ? editingUser.Username : ''} rules={[{ required: true, message: 'Please input the username!' }]}>
                        <Input className="border-gray-300 focus:border-blue-500" />
                    </Form.Item>
                    <Form.Item name="Password" label="Password" initialValue={editingUser ? editingUser.Password : ''} rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input.Password className="border-gray-300 focus:border-blue-500" />
                    </Form.Item>
                    <Form.Item name="NIC" label="NIC" initialValue={editingUser ? editingUser.NIC : ''} rules={[{ required: true, message: 'Please input the NIC!' }]}>
                        <Input className="border-gray-300 focus:border-blue-500" />
                    </Form.Item>
                    <Form.Item name="Trainee_Name" label="Trainee Name" initialValue={editingUser ? editingUser.Trainee_Name : ''} rules={[{ required: true, message: 'Please input the trainee name!' }]}>
                        <Input className="border-gray-300 focus:border-blue-500" />
                    </Form.Item>
                    <Form.Item name="Leave_Count" label="Leave Count" initialValue={editingUser ? editingUser.Leave_Count : 0} rules={[{ required: true, message: 'Please input the leave count!' }]}>
                        <Input type="number" className="border-gray-300 focus:border-blue-500" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600 transition duration-300">
                            {editingUser ? "Update" : "Add"} User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageUsers;
