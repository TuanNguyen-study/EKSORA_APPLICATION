import React, { useEffect, useState } from "react";
import {
  Typography,
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import { getVoucher, postVoucher, deleteVoucher } from "../../API";

const { Option } = Select;

function Voucher() {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await getVoucher();
      
      const data = Array.isArray(res?.data) ? res.data : [];

      const formatted = data.map((voucher, index) => ({
        key: voucher._id || index,
        _id: voucher._id,
        code: voucher.code,
        discount: voucher.discount,
        start_date: voucher.start_date,
        end_date: voucher.end_date,
        status: voucher.status,
      }));

      setVouchers(formatted);
    } catch (err) {
      console.error("Fetch vouchers failed", err);
      message.error("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setCurrentItem(item);
    form.setFieldsValue(
      item
        ? {
            ...item,
            start_date: dayjs(item.start_date),
            end_date: dayjs(item.end_date),
          }
        : {
            code: "",
            discount: "",
            start_date: null,
            end_date: null,
            status: "active",
          }
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const formatted = {
        ...values,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
      };

      if (currentItem) {
        message.success("Voucher updated successfully!");
      } else {
        const res = await postVoucher(formatted);
        if (!res || res.error) {
          throw new Error("API failed");
        }
        message.success("Voucher added successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchVouchers();
    } catch (err) {
      console.error("Save error", err);
      message.error("Failed to save voucher");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteVoucher(id);
      if (!res || res.error) {
        throw new Error("API failed");
      }
      message.success("Deleted successfully");
      fetchVouchers();
    } catch (err) {
      console.error("Delete error", err);
      message.error("Failed to delete voucher");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
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
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Typography.Title level={4}>Voucher Management</Typography.Title>

      <Button type="primary" onClick={() => openModal()}>
        Add Voucher
      </Button>

      <Table
        loading={loading}
        columns={columns}
        dataSource={vouchers}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={currentItem ? "Edit Voucher" : "Add Voucher"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Please enter code" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[{ required: true, message: "Please enter discount" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Voucher;
