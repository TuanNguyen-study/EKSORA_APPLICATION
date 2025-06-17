import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ visible, onClose }) => {
    const [loading, setLoading] = useState(false); 
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = (values) => {
        setLoading(true);
       
        setTimeout(() => {
            // Simulating a successful login response
            message.success("Login successful");
            setLoading(false);
            onClose(); 
            navigate("/"); 
        }, 2000);
    };

    return (
        <Modal
        title={null} // Remove default modal title
        visible={visible}
        onCancel={onClose}
        footer={null}
        centered // Center the modal vertically
        width={400} // Customize modal width
      >
        <div style={{ textAlign: "center" }}>
          {/* Custom Image */}
          <img
            width={60}
            style={{ marginBottom: 20 }}
            src="https://s3-alpha-sig.figma.com/img/4e6b/b9f0/95e467187d480b653294640f2d19d0a2?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kSXpSGtjItb8xhRCUUjHql3p7EvZDZTR8p6k7BwoVYGtFSgolm9evxeC6L7EZGv7qRiJ80IApEIix4uHl49RgEnJYNV2rzrBLO3rdv1y30IHMYHhRtzE3BpObrEetSCOs7Lo~5nRPsRlgyH2rLGS-PBdFPaiHMT193hs9dhh3BkRMvOeOYIIwH4FPeAfcogEdMPTOgpocpc8OqYln04IicHn8wjFY3p8KJll6-J3gRAvOaLNWelvjcfQBgx3Zekn0~ZklWsvYlBBvEB7On4P0h39wx8-2GCMdr9df5rzHyPo2a3G-rC5dISv7NyBlOBHhj-VF2UWeu1iOsmPCB02eA__"
            alt="Login"
          />
          <h2 style={{ marginBottom: 20 }}>Welcome Back!</h2>
        </div>
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          style={{ padding: "0 20px" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
  
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
  
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
       
      </Modal>       
    );
};

export default LoginModal;
