import { Button, Typography, Space, Table, Avatar, Popconfirm, Modal, Form, Input, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { getCustomers } from "../../API";
import { UploadOutlined } from '@ant-design/icons';

function Customers() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Track if it's Edit or Add mode
    const [currentCustomer, setCurrentCustomer] = useState(null); // Store the customer being edited
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        setLoading(true);
        getCustomers().then((res) => {
            setDataSource(res.users);
            setLoading(false);
        });
    }, []);

    const handleEdit = (record) => {
        setIsEditMode(true); // Switch to edit mode
        setCurrentCustomer(record); // Set the current customer
        setImageUrl(record.imageUrl || ""); // Set imageUrl for the current customer
        form.setFieldsValue(record); // Pre-fill form with customer data
        setIsModalVisible(true); // Open the modal
    };

    const handleDelete = (customerId) => {
        console.log("Delete action triggered for customer ID:", customerId);
        setDataSource((prevData) => prevData.filter((customer) => customer.id !== customerId));
    };

    const handleAddMember = () => {
        setIsEditMode(false); 
        setCurrentCustomer(null); 
        setImageUrl(""); 
        form.resetFields(); 
        setIsModalVisible(true); 
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log(isEditMode ? "Editing customer:" : "Adding new member:", values);
                if (isEditMode) {
                    setDataSource((prevData) =>
                        prevData.map((customer) =>
                            customer.id === currentCustomer.id ? { ...customer, ...values, imageUrl } : customer
                        )
                    );
                } else {
                    const newCustomer = {
                        ...values,
                        id: Date.now(), 
                        imageUrl,
                    };
                    setDataSource([...dataSource, newCustomer]);
                }
                setIsModalVisible(false); 
                form.resetFields(); 
                setImageUrl(""); 
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setImageUrl("");
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.url); 
            message.success('Image uploaded successfully');
        } else if (info.file.status === 'error') {
            message.error('Image upload failed');
        }
    };

    return (
        <Space size={20} direction="vertical">
            <Typography.Title level={4}>Customers</Typography.Title>
            <Button type="primary" onClick={handleAddMember}>
                Add Member
            </Button>
            <Table
                loading={loading}
                columns={[
                    {
                        title: "Photo",
                        dataIndex: "imageUrl",
                        render: (link) => <Avatar src={link} />,
                    },
                    {
                        title: "First Name",
                        dataIndex: "firstName",
                    },
                    {
                        title: "Last Name",
                        dataIndex: "lastName",
                    },
                    {
                        title: "Email",
                        dataIndex: "email",
                    },
                    {
                        title: "Phone",
                        dataIndex: "phone",
                    },
                    {
                        title: "Address",
                        dataIndex: "address",
                        render: (address) => (
                            <span>
                                {address.address}, {address.city}
                            </span>
                        ),
                    },
                    {
                        title: "Action",
                        render: (_, record) => (
                            <Button type="primary" onClick={() => handleEdit(record)}>
                                Edit
                            </Button>
                        ),
                    },
                    {
                        title: "Delete",
                        render: (_, record) => (
                            <Popconfirm
                                title="Are you sure to delete this customer?"
                                onConfirm={() => handleDelete(record.id)} d
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="default">Delete</Button>
                            </Popconfirm>
                        ),
                    },
                ]}
                dataSource={dataSource}
                pagination={{
                    pageSize: 5,
                }}
            />

            <Modal
                title={isEditMode ? "Edit Customer" : "Add New Member"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" name="customer_form">
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: "Please input the first name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: "Please input the last name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input the email!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please input the phone number!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please input the address!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Profile Picture" name="image">
                        <Upload
                            name="image"
                            action="/upload" 
                            listType="picture"
                            showUploadList={false}
                            onChange={handleImageChange}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}

export default Customers;
