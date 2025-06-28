import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CreateUser from "./components/CreateUser";
import useUser from "./hooks/useUser";
import "./user.css";
import { User } from "../../../api/request";
import { debounce } from "lodash";
import moment from "moment";
import { setPageTitle } from "../../../utils/titleUtils";

function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const { userList, isLoading } = useUser({});

  const [filteredRows, setFilteredRows] = useState(userList);
  useEffect(() => {
    setPageTitle("Users -HMS");
    return () => setPageTitle("HMS");
  }, []);
  // console.log("list", userList[0].personId[0].firstName);
  const handleSearch = debounce((event) => {
    const term = event.target.value;
    const filtered = userList.filter((user_list: any) =>
      user_list?.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRows(filtered);
  }, 700);
  const handleEdit = async (id: any) => {
    const response = await User.getById(id);
    console.log("user data:", response.data, "id: ", id);
    setData(response.data);
    setIsOpen(true);
  };

  const column: any = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "Role",
      dataIndex: "roleId",
      render: (_: any, record: any) => {
        return record?.roleId?.name;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "Password",
      dataIndex: "password",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (_: any, record: any) => {
        return record?.createdDate
          ? moment(new Date(record?.createdDate).toUTCString()).format(
              "DD/MM/YYYY"
            )
          : "";
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: { id: any }) => (
        <EditOutlined
          style={{ marginRight: 15 }}
          onClick={() => handleEdit(record.id)}
        />
      ),
    },
  ];

  const handleDelete = (key: any) => {};

  return (
    <>
      <div className="set-btn-onConer">
        <div>
          <label>
            <h1>Users</h1>
          </label>
        </div>
        <div className="location-action">
          <Input
            className="Search-btn"
            placeholder="Search here..."
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
          <Button icon={<UserAddOutlined />} onClick={() => setIsOpen(true)}>
            {" "}
            Add User
          </Button>
        </div>
      </div>

      <Table
        columns={column}
        dataSource={filteredRows ? filteredRows : userList}
        loading={isLoading}
      />

      {isOpen && (
        <CreateUser
          isOpen={isOpen}
          data={data}
          onClose={() => {
            setIsOpen(false);
            setData([]);
          }}
        />
      )}
    </>
  );
}
export default Users;
