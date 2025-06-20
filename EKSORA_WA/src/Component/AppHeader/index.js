import { BellFilled, MailOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import { useEffect, useState } from "react";
function AppHeader (){
   return(
         <header className="AppHeader">
            <img
        width={60}
        src="https://s3-alpha-sig.figma.com/img/4e6b/b9f0/95e467187d480b653294640f2d19d0a2?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kSXpSGtjItb8xhRCUUjHql3p7EvZDZTR8p6k7BwoVYGtFSgolm9evxeC6L7EZGv7qRiJ80IApEIix4uHl49RgEnJYNV2rzrBLO3rdv1y30IHMYHhRtzE3BpObrEetSCOs7Lo~5nRPsRlgyH2rLGS-PBdFPaiHMT193hs9dhh3BkRMvOeOYIIwH4FPeAfcogEdMPTOgpocpc8OqYln04IicHn8wjFY3p8KJll6-J3gRAvOaLNWelvjcfQBgx3Zekn0~ZklWsvYlBBvEB7On4P0h39wx8-2GCMdr9df5rzHyPo2a3G-rC5dISv7NyBlOBHhj-VF2UWeu1iOsmPCB02eA__"
      ></img>
     <Typography.Title  style={{ fontSize: 24 }}>Chicken Order Dashboard</Typography.Title>
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