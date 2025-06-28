import React, { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useSessionExpiry from "../components/hooks/useSessionExpiry";
const Layout = React.lazy(() => import("../components/layouts/Layout"));

type PrivateRoutesProperties = {
  children?: ReactNode;
};

const PrivateRoutes: FC<PrivateRoutesProperties> = ({ children }) => {
  const isAuthenticated = useSessionExpiry();
  return (
    <div>
              {/* <Layout>{children || <Outlet />}</Layout> */}

      {isAuthenticated ? (
        <Layout>{children || <Outlet />}</Layout>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default PrivateRoutes;
