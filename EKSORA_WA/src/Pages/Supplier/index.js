import {
  Button,
  Typography,
  Space,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { getSuppliers } from "../../API";

function Suppliers() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    getSuppliers()
      .then((res) => {
        if (Array.isArray(res)) {
          setDataSource(res);
        } else {
          message.error("Lỗi định dạng dữ liệu đối tác!");
        }
      })
      .catch(() => message.error("Không thể tải danh sách đối tác!"))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (record) => {
    setIsEditMode(true);
    setCurrentSupplier(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (supplierId) => {
    setDataSource((prev) =>
      prev.filter((supplier) => supplier._id !== supplierId)
    );
    message.success("Đã xoá đối tác!");
  };

  const handleAddSupplier = () => {
    setIsEditMode(false);
    setCurrentSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          setDataSource((prev) =>
            prev.map((supplier) =>
              supplier._id === currentSupplier._id
                ? { ...supplier, ...values }
                : supplier
            )
          );
          message.success("Đã cập nhật đối tác!");
        } else {
          const newSupplier = {
            ...values,
            _id: Date.now().toString(), // Fake ID
          };
          setDataSource((prev) => [...prev, newSupplier]);
          message.success("Đã thêm đối tác mới!");
        }
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Danh sách đối tác</Typography.Title>
      <Button type="primary" onClick={handleAddSupplier}>
        Thêm đối tác
      </Button>
      <Table
        loading={loading}
        dataSource={dataSource}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: "Tên đối tác",
            dataIndex: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
          },
          {
            title: "Địa chỉ",
            dataIndex: "address",
          },
          {
            title: "Mô tả",
            dataIndex: "description",
          },
          {
            title: "Thao tác",
            render: (_, record) => (
              <Space>
                <Button type="primary" onClick={() => handleEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn chắc chắn muốn xoá đối tác này?"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button danger>Xoá</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={isEditMode ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên đối tác"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đối tác!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Suppliers;
