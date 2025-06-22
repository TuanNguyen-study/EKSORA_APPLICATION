import { BellFilled, MailOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import { useEffect, useState } from "react";
function AppHeader (){
   return(
         <header className="AppHeader">
            <img
        width={60}
        src="../../../public/logo.jpg."
      ></img>
     <Typography.Title  style={{ fontSize: 24 }}>EKSORA DASHBOARD</Typography.Title>
      <Space>
        <Badge count={10} dot>
          <MailOutlined
            style={{ fontSize: 24 }}
          />
        </Badge>
        <Badge count={20}>
          <BellFilled
            style={{ fontSize: 24 }}
          />
        </Badge>
      </Space>
         </header>
   )
}

export default AppHeader;