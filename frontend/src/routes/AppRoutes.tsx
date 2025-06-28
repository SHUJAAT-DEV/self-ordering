import { Spin } from "antd";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

import MenueScreen from "../components/Landing page/Menues/Menue";
import OrderConfirmedPage from "../components/Landing page/order information/orderConfirmed";
import CounterScreen from "../components/pages/counter/Counter";
import DashboardPage from "../components/pages/dashboard/dashboard";
import KitchenScreen from "../components/pages/kitchen/KitchenScreen";
import MenueCategoryPage from "../components/pages/menue-category/menueCategory";
import MenuePage from "../components/pages/menue/menue";
import OrderPage from "../components/pages/order/order";
import RunningOrder from "../components/pages/running-order/running-order";
import TablePage from "../components/pages/table/table";
import Invoice from "../components/Landing page/invoice/invoice";
import SaleStatement from "../components/Landing page/statement/SaleStatement";
import CartComponent from "../components/testing/testing";
import TableScreenWaiter from "../components/pages/TableScreen/TableScreenWaiter";
import TestComponent from "../components/Landing page/test";

const Login = lazy(() => import("../components/pages/auth/Login"));
const PageNotFound = lazy(() => import("../components/pages/PageNotFound"));
const Users = lazy(() => import("../components/pages/users/Users"));

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="spinner">
          <Spin size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/menue" element={<MenuePage />} />
          <Route path="/menue-category" element={<MenueCategoryPage />} />
          <Route path="/tables" element={<TablePage />} />
          <Route path="/orders" element={<OrderPage />} />          
          <Route path="/invoice" element={<Invoice/>} />
          <Route path="/statement" element={<SaleStatement/>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/counter" element={<CounterScreen />} />
        <Route path="/table-screen" element={<TableScreenWaiter/>} />
        <Route path="/kitchen" element={<KitchenScreen />} />
        <Route path="/test" element={<TestComponent/>} />
        <Route path="/testing" element={<CartComponent/>} />
        <Route path="/table-screen/:tableNumber" element={<MenueScreen />} />
      </Routes>
    </Suspense>
  );
}
