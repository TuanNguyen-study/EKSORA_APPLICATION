
import {
    AppstoreOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SketchOutlined,
    SettingOutlined,
  } from "@ant-design/icons";
  import { Menu,Divider  } from "antd";
  import { useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
function SideMenu (){
    const navigate = useNavigate();

    return(
        <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
        //    item.key
          navigate(item.key);
        }}
       
        items={[
          {
            label: "Dashboard",
            icon: <AppstoreOutlined />,
            key: "/",
          },
          {
            label: "Inventory",
            key: "/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Promotion",
            key: "/Promo",
            icon: <SketchOutlined />,
          },
          {
            label: "Orders",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Customers",
            key: "/customers",
            icon: <UserOutlined />,
          },
          {
            type: "divider", // This is where the break line is added
          },
          {
            label: "Account Settings",  
            key: "/account-settings",  
            icon: <SettingOutlined />,  
        },
        ]}
      ></Menu>
    </div>
     );
    
 }
 
 export default SideMenu;