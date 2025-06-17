import { Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
function AppFooter (){
    return (
      <footer>
      <div className="AppFooter">
      <Typography.Link href="tel:+123456789">+123456789</Typography.Link>
      <Typography.Link href="https://www.google.com" target={"_blank"}>
        Privacy Policy
      </Typography.Link>
      <Typography.Link href="https://www.google.com" target={"_blank"}>
        Terms of Use
      </Typography.Link>
     
    </div>
    <div>Copyright © 2024 Happyland of Karen. All rights reserved.</div>
    </footer>
    );
}

export default AppFooter;