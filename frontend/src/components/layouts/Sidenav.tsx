import { Menu, Button } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Icon } from "../UI/icons/Icon";

function Sidenav() {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const color = "";
  return (
    <>
      <div className="brand" style={{ textAlign: "center" }}>
        <img src={logo} alt="" style={{ width: "20vh", height: "6vh" }} />
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="dashboard">
          <NavLink to="/">
            <span
              className="icon"
              style={{ background: page === "dashboard" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="users">
          <NavLink to="/users">
            <span
              className="icon"
              style={{ background: page === "users" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Users</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menue">
          <NavLink to="/menue">
            <span
              className="icon"
              style={{ background: page === "menue" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Menue</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menueCategory">
          <NavLink to="/menue-category">
            <span
              className="icon"
              style={{ background: page === "menueCategory" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Menue Category</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="orders">
          <NavLink to="/orders">
            <span
              className="icon"
              style={{ background: page === "orders" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Orders</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="tables">
          <NavLink to="/tables">
            <span
              className="icon"
              style={{ background: page === "tables" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Table</span>
          </NavLink>
        </Menu.Item>

        {/* <Menu.Item key="running/order">
          <NavLink to="/running/order">
            <span
              className="icon"
              style={{ background: page === "running-order" ? color : "" }}
            >
              <Icon type="dashboard" color={color} />
            </span>
            <span className="label">Running Order</span>
          </NavLink>
        </Menu.Item> */}
      </Menu>
      <div>
        <div
          className="footer-box"
          style={{
            background: color,
          }}
        >
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button
            type="primary"
            className="ant-btn-sm ant-btn-block"
            style={{
              height: "2rem",
            }}
          >
            info@hms.com
          </Button>
        </div>
      </div>
    </>
  );
}

export default Sidenav;
