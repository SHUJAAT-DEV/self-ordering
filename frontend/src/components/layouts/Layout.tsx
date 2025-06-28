import { Affix, Drawer, Layout } from "antd";
import { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidenav from "./Sidenav";

const { Header: AntHeader, Content, Sider } = Layout;

type MainLayoutProperties = {
  children: any
}

function MainLayout({ children }: MainLayoutProperties) {

  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  const openDrawer = () => setVisible(!visible);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""
        } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={placement === "right" ? "left" : "right"}
        width={250}
        className={`drawer-sidebar ${
          pathname === "rtl" ? "drawer-sidebar-rtl" : ""
        } `}
      >
        <Layout
          className={`layout-dashboard ${pathname === "rtl" ? "layout-dashboard-rtl" : ""
            }`}
        >
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${
              sidenavType === "#fff" ? "active-route" : ""
            }`}
            style={{ background: sidenavType }}
          >
            <Sidenav />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
          }`}
        style={{ background: sidenavType }}
      >
        <Sidenav />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : "ant-header-fixed"}`}>
              <Header
                name={pathname}
                onPress={openDrawer}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              name={pathname}
              onPress={openDrawer}
            />
          </AntHeader>
        )}
        <Suspense fallback={<p>Loading...</p>}>
           <Content className="content-ant">{children}</Content>
        </Suspense>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default MainLayout;