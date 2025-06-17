import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../Component/LoginModal"; 

const AccountSettings = () => {
    const [imageUrl, setImageUrl] = useState(""); 
    const [form] = Form.useForm();
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false); 
    const navigate = useNavigate();

    // Handle image change
    const handleImageChange = (info) => {
        if (info.file.status === "done") {
            setImageUrl(info.file.response.url); 
            message.success("Image uploaded successfully");
        } else if (info.file.status === "error") {
            message.error("Image upload failed");
        }
    };

    // Handle form submission
    const handleSubmit = (values) => {
        console.log("Form submitted with values:", values);
       


        message.success("Account settings updated successfully!");
        navigate("/");
    };

    // Handle logout
    const handleLogout = () => {

        localStorage.removeItem("authToken"); 
        message.success("You have logged out successfully!");
        setIsLoginModalVisible(true);
    };

    // Show Login Modal
    const showLoginModal = () => {
        setIsLoginModalVisible(true);
    };

    // Hide Login Modal
    const hideLoginModal = () => {
        setIsLoginModalVisible(false);
    };

    return (
        <>
        <div style={{ padding: 20 }}>
            <h2>Account Settings</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    username: "John Doe", 
                    email: "johndoe@example.com", 
                }}
            >
                <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
                    <Input type="email" placeholder="Enter your email" />
                </Form.Item>

                <Form.Item label="Password" name="password">
                    <Input.Password placeholder="Enter a new password" />
                </Form.Item>

                <Form.Item label="Confirm Password" name="confirmPassword" dependencies={["password"]} 
                    rules={[{ 
                            required: true, 
                            message: "Please confirm your password!" 
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("The two passwords that you entered do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Form.Item label="Profile Picture" name="profilePicture">
                    <Upload
                        name="profilePicture"
                        action="/upload" 
                        listType="picture"
                        showUploadList={false}
                        onChange={handleImageChange}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                    </Upload>
                    {imageUrl && <Avatar src={imageUrl} size={64} />}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>

            <Button type="default" onClick={handleLogout} style={{ marginTop: 20 }}>
                Logout
            </Button>

            <LoginModal visible={isLoginModalVisible} onClose={hideLoginModal} />
        </div>
        </>
    );
};

export default AccountSettings;
