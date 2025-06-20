import { Card, Space, Statistic, Table, Typography, Row, Col } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getNewProducts, getInventory, getCustomers } from "../../API";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [menuItems, setMenuItems] = useState(0); // State to store the menu item count
  const [customer, setCustomers] = useState(0);
  useEffect(() => {
    // Fetch inventory data
    getInventory().then((res) => {
      setMenuItems(res.data.length); 

    getCustomers().then((res) => {
      setCustomers(res.users.length);
    }).catch((err) => {
      console.error("Error fetching inventory:", err);
    });
  }, [])}); // Empty dependency array to fetch only on mount

  return (
    <div style={{ padding: 20, maxWidth: "100%" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ textAlign: "center", color: "#3b5998" }}>Dashboard</Typography.Title>

        {/* Cards Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <DashboardCard
              icon={<ShoppingCartOutlined style={{ color: "green", fontSize: 30 }} />}
              title="Đơn hàng"
              value={12345}
              bgColor="linear-gradient(to right, #56ab2f, #a8e063)"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DashboardCard
              icon={<ShoppingOutlined style={{ color: "blue", fontSize: 30 }} />}
              title="Menu"
              value={menuItems} // Display dynamic menu items count
              bgColor="linear-gradient(to right, #36d1dc, #5b86e5)"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DashboardCard
              icon={<UserOutlined style={{ color: "cyan", fontSize: 30 }} />}
              title="Khách hàng"
              value={customer}
              bgColor="linear-gradient(to right, #ff512f, #dd2476)"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DashboardCard
              icon={<DollarCircleOutlined style={{ color: "red", fontSize: 30 }} />}
              title="Doanh thu"
              value={12345}
              bgColor="linear-gradient(to right, #ffe000, #799f0c)"
            />
          </Col>
        </Row>

        {/* Chart and Table Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <SalesChart />
          </Col>
          <Col xs={24} lg={8}>
            <RecentNewProducts />
          </Col>
        </Row>
      </Space>
    </div>
  );
}

function DashboardCard({ title, value, icon, bgColor }) {
  return (
    <Card
      style={{
        borderRadius: 12,
        background: bgColor,
        color: "#fff",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      hoverable
      bodyStyle={{ padding: 20 }}
    >
      <Space size="middle">
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </div>
        <Statistic title={title} value={value} valueStyle={{ color: "#fff" }} />
      </Space>
    </Card>
  );
}

function RecentNewProducts() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNewProducts().then((res) => {
      setDataSource(res.data.products || []);
      setLoading(false);
    });
  }, []);

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
      hoverable
    >
      <Typography.Title level={4}>New Popchese Combo</Typography.Title>
      <Table
        columns={[
          {
            title: "Image",
            dataIndex: "images",
            render: (images) => {
              const imageUrl = images && images[0]?.desktopUrl;
              return imageUrl ? (
                <img src={imageUrl} alt="Product" style={{ width: 50, height: 50, borderRadius: 5 }} />
              ) : (
                "No image available"
              );
            },
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Price",
            dataIndex: "price",
          },
          {
            title: "Description",
            dataIndex: "description",
          },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

function SalesChart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 3000, 5000, 2400, 3400],
        borderColor: "#56ab2f",
        backgroundColor: "rgba(86, 171, 47, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
        font: { size: 16 },
        color: "#333",
      },
    },
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
      hoverable
    >
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Sales Chart
      </Typography.Title>
      <Line data={data} options={options} />
    </Card>
  );
}

export default Dashboard;
