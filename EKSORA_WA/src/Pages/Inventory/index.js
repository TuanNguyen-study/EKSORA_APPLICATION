import React, { useEffect, useState } from "react";
import {
  Typography,
  Space,
  Table,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Rate,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getInventory } from "../../API"; // API trả về danh sách tour

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await getInventory();
        const dataRaw = Array.isArray(res) ? res : res.data || [];

        const formatted = dataRaw.map((item) => ({
          ...item,
          imageUrl: item.image?.[0] || "", // chỉ lấy ảnh đầu tiên
        }));

        setDataSource(formatted);
      } catch (err) {
        console.error("Fetch failed", err);
        message.error("Failed to load tour list");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const openModal = (item = null) => {
    setCurrentItem(item);
    form.setFieldsValue(
      item || {
        name: "",
        description: "",
        location: "",
        duration: "",
        price: "",
        province: "",
      }
    );
    setFileList(
      item?.image?.length
        ? [
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: item.image[0],
            },
          ]
        : []
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const imageUrl = fileList[0]?.url || fileList[0]?.response?.url || "";
      const dataImg = {
        ...values,
        image: [imageUrl],
      };

      if (currentItem) {
        // await updateTour(currentItem._id, data);
        message.success("Tour updated successfully!");
      } else {
        // await addTour(data);
        message.success("Tour added successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);

      const res = await getInventory();
      const data = Array.isArray(res) ? res : res.data || [];
      const formatted = data.map((item) => ({
        ...item,
        imageUrl: item.image?.[0] || "",
      }));
      setDataSource(formatted);
    } catch (err) {
      console.error("Save error", err);
      message.error("Failed to save tour");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await deleteTour(id);
      message.success("Deleted successfully");

      const res = await getInventory();
      const dataRaw = Array.isArray(res) ? res : res.data || [];
      const formatted = dataRaw.map((item) => ({
        ...item,
        imageUrl: item.image?.[0] || "",
      }));
      setDataSource(formatted);
    } catch (err) {
      console.error("Delete error", err);
      message.error("Failed to delete tour");
    }
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Typography.Title level={4}>Tour Inventory</Typography.Title>

      <Button type="primary" onClick={() => openModal()}>
        Add Tour
      </Button>

      <Table
        loading={loading}
        dataSource={dataSource}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: "Image",
            dataIndex: "imageUrl",
            render: (url) =>
              url ? (
                <Avatar src={url} size={64} shape="square" />
              ) : (
                "No Image"
              ),
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Description",
            dataIndex: "description",
            render: (desc) =>
              desc?.length > 50 ? desc.slice(0, 50) + "..." : desc,
          },
          {
            title: "Location",
            dataIndex: "location",
          },
          {
            title: "Duration",
            dataIndex: "duration",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (price) => `${price?.toLocaleString()} VND`,
          },
          {
            title: "Province",
            dataIndex: "province",
          },
          {
            title: "Rating",
            dataIndex: "rating",
            render: (rating) => <Rate disabled defaultValue={rating || 0} />,
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => openModal(record)}>
                  Edit
                </Button>
                <Button danger type="link" onClick={() => handleDelete(record._id)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={currentItem ? "Edit Tour" : "Add Tour"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter tour name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <Input placeholder="e.g., 2 ngày 1 đêm" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input type="number" placeholder="Enter price in VND" />
          </Form.Item>

          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Please enter province" }]}
          >
            <Input placeholder="Enter province" />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              action="/api/upload"
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Inventory;
