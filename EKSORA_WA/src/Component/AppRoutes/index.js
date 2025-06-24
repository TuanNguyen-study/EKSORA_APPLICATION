import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customers from "../../Pages/Supplier";
import Dashboard from "../../Pages/Dashboard";
import Inventory from "../../Pages/Tours";
import Orders from "../../Pages/Orders";
import Promo from "../../Pages/Voucher";
import AccountSettings from "../../Pages/AccountSetting";
function AppRoutes (){
    return(
       
        <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/inventory" element={<Inventory />}></Route>
            <Route path="/voucher" element={<Promo />}></Route>
            <Route path="/orders" element={<Orders />}></Route>
            <Route path="/suppliers" element={<Customers />}></Route>
            <Route path="/account-settings" element={<AccountSettings />}></Route>
        </Routes>

    )
 }

 export default  AppRoutes;