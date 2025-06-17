import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customers from "../../Pages/Customers";
import Dashboard from "../../Pages/Dashboard";
import Inventory from "../../Pages/Inventory";
import Orders from "../../Pages/Orders";
import Promo from "../../Pages/Promotion";
import AccountSettings from "../../Pages/AccountSetting";
function AppRoutes (){
    return(
       
        <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/inventory" element={<Inventory />}></Route>
            <Route path="/promo" element={<Promo />}></Route>
            <Route path="/orders" element={<Orders />}></Route>
            <Route path="/customers" element={<Customers />}></Route>
            <Route path="/account-settings" element={<AccountSettings />}></Route>
        </Routes>

    )
 }

 export default  AppRoutes;