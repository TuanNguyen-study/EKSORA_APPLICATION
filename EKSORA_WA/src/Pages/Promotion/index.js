import { Button, Typography, Space, Table, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { getPromo } from "../../API";

function Promo() {
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const product = await getPromo();
                // Extracting promotions
                const data = product.data.promotions;
                const formattedPromotions = data.map((promo, index) => ({
                    key: promo.promotionId || index, 
                    promotionId: promo.promotionId,
                    name: promo.name || "Unnamed Promotion",
                    description: promo.description || "No description available",
                }));
                setPromotions(formattedPromotions);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setProductDetails(null);
                setPromotions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, []);

    return (
        <Space size={20} direction="vertical" style={{ width: "100%" }}>
            

            <Typography.Title level={4}>Promotions</Typography.Title>
            <Table
                loading={loading}
                columns={[
                    {
                        title: "Promotion Id",
                        dataIndex: "promotionId",
                    },
                    {
                        title: "Name",
                        dataIndex: "name",
                    },
                    {
                        title: "Description",
                        dataIndex: "description",
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
                                title="Are you sure to delete this promotion?"
                                onConfirm={() => handleDelete(record.promotionId)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="default">Delete</Button>
                            </Popconfirm>
                        ),
                    },
                ]}
                dataSource={promotions}
                pagination={{ pageSize: 5 }}
            />
        </Space>
    );
    function handleEdit(record) {
        console.log("Edit action triggered for:", record);
    }
    const handleDelete = (promotionId) => {
        console.log("Delete action triggered for promotion ID:", promotionId);
        setPromotions((prevPromotions) =>
            prevPromotions.filter((promo) => promo.promotionId !== promotionId)
        );
    };
}

export default Promo;
