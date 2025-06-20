import { Avatar, Rate, Typography, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { getRevenue } from "../../API"; // Ensure getRevenue is correctly imported

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getRevenue().then((res) => {
      const orders = res.data || [];
      const formattedData = orders.map(order => ({
        key: order._id, 
        user_id: order.user_id,
        user_name: order.user_name,
        address: order.address,
        type_pay: order.type_pay,
        totalPrice: order.totalPrice,
        is_pay: order.is_pay === 1 ? "Paid" : "Not Paid", 
        is_cart: order.is_cart === 3 ? "Cart" : "Order", 
        products: order.product.join(", "),
      }));
      setDataSource(formattedData);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching orders:", err);
      setLoading(false);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Orders</Typography.Title>
      <Table
        loading={loading}
        columns={[
          {
            title: "User ID",
            dataIndex: "user_id",
          },
          {
            title: "User Name",
            dataIndex: "user_name",
          },
          {
            title: "Address",
            dataIndex: "address",
          },
          {
            title: "Products",
            dataIndex: "products",
          },
          {
            title: "Payment Type",
            dataIndex: "type_pay",
          },
          {
            title: "Total Price",
            dataIndex: "totalPrice",
            render: (text) => `${text.toLocaleString()} VND`,
          },
        ]}
        dataSource={dataSource}
        pagination={{
          pageSize: 5,
        }}
      />
    </Space>
  );
}

export default Orders;
