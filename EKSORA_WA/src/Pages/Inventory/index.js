import React, { useEffect, useState } from "react";
import { Typography, Space, Table, Avatar, Button, Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getInventory } from "../../API"; 

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [fileList, setFileList] = useState([]); 
  const [form] = Form.useForm();

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await getInventory();
        const inventory = res.data || [];
        const formattedData = inventory.map((item) => ({
          ...item,
          categories: item.categories
            ? item.categories.map((cat) => cat.name).join(", ")
            : "No categories",
          imageUrl: item.images?.[0]?.desktopUrl || "",
        }));
        setDataSource(formattedData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        message.error("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Open modal for Add/Edit
  const openModal = (item = null) => {
    setCurrentItem(item);
    form.setFieldsValue(item || { name: "", categories: "", price: "", stock: "" });
    setFileList(
      item?.images
        ? [
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: item.images[0].desktopUrl,
            },
          ]
        : []
    );
    setIsModalOpen(true);
  };

  // Handle Add/Edit submission
  const handleSubmit = async (values) => {
    try {
      const imageUrl = fileList[0]?.url || fileList[0]?.response?.url;
      const data = { ...values, imageUrl };
      if (currentItem) {
        // await editMenuItem(currentItem.id, data); 
        message.success("Menu item updated successfully!");
      } else {
        // await addMenuItem(data);
        message.success("New menu item added successfully!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      setDataSource(await getInventory().then((res) => res.data));
    } catch (error) {
      console.error("Error saving menu item:", error);
      message.error("Failed to save menu item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await deleteMenuItem(id);
      message.success("Menu item deleted successfully!");
      setDataSource(await getInventory().then((res) => res.data)); 
    } catch (error) {
      console.error("Error deleting menu item:", error);
      message.error("Failed to delete menu item.");
    }
  };

  // Handle image upload
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Inventory</Typography.Title>
      <Button type="primary" onClick={() => openModal()}>
        Add Menu Item
      </Button>
      <Table
        loading={loading}
        columns={[
          {
            title: "Image",
            dataIndex: "imageUrl",
            render: (imageUrl) =>
              imageUrl ? (
                <Avatar
                  src={imageUrl}
                  size={64}
                  shape="square"
                  alt="Product Image"
                />
              ) : (
                "No Image"
              ),
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Categories",
            dataIndex: "categories",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>{value} VND</span>,
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space size="middle">
                <Button type="link" onClick={() => openModal(record)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
      />
      {/* Modal for Add/Edit */}
      <Modal
        title={currentItem ? "Edit Menu Item" : "Add Menu Item"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: "",
            categories: "",
            price: "",
            stock: "",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item
            label="Categories"
            name="categories"
            rules={[{ required: true, message: "Please enter categories!" }]}
          >
            <Input placeholder="Enter categories (comma-separated)" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter the stock quantity!" }]}
          >
            <Input placeholder="Enter stock quantity" />
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
