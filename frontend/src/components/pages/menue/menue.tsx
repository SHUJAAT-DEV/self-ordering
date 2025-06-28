import { Button, Input, Table, Tooltip, Image } from "antd";
import { useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { Menue } from "../../../api/request";
import CreateMenue from "./components/CreateMenu";
import useMenue from "./hooks/useMenue";
import { BASE_URL } from "../../../api/http";
import DeleteMenu from "./components/DeleteMenu";

function MenuePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState([]);
  const { menueList, isLoading } = useMenue({});

  const [filteredRows, setFilteredRows] = useState(menueList);
  const handleSearch = debounce((event) => {
    const term = event.target.value;
    const filtered = menueList.filter((user_list: any) =>
      user_list?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRows(filtered);
  }, 700);
  const handleEdit = async (id: any) => {
    const response = await Menue.getById(id);
    setData(response.data);
    setIsOpen(true);
  };
  const handleDelete = async (id: any) => {
    const response = await Menue.getById(id);

    setData(response.data);
    setIsOpenDelete(true);
  };

  const column: any = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any) => {
        return (
          <div>
            <Image
              src={BASE_URL + record?.image}
              style={{ width: "2rem", height: "2rem" }}
            />
            <span> {record?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Menue Category",
      dataIndex: "menuCategoryId",
      render: (_: any, record: any) => {
        return record?.menueCategoryId?.name;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    // {tt
    //   title: "Discount",
    //   dataIndex: "discount",
    //   render: (_: any, record: any) => {
    //     return record?.discount !== null ? record?.discount : "0";
    //   },
    // },
    {
      title: "Is Available",
      dataIndex: "isAvailable",
      render: (_: any, record: any) => {
        return record?.isAvailable === true ? "Yes" : "No";
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: { id: any }) => (
        <>
          <Tooltip placement="top" title="Edit">
            <EditOutlined
              onClick={() => handleEdit(record.id)}
              //style={{ color: "#00a678" }}
            />{" "}
          </Tooltip>
          <span>&nbsp;&nbsp;</span>
          <Tooltip placement="top" title="Delete">
            <DeleteOutlined
              onClick={() => handleDelete(record.id)}
              //style={{ color: "#00a678" }}
            />{" "}
          </Tooltip>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="set-btn-onConer">
        <div>
          <label>
            <h1>Menue</h1>
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
            Add Menue
          </Button>
        </div>
      </div>

      <Table
        columns={column}
        dataSource={filteredRows ? filteredRows : menueList}
        loading={isLoading}
      />

      {isOpen && (
        <CreateMenue
          isOpen={isOpen}
          data={data}
          onClose={() => {
            setIsOpen(false);
            setData([]);
          }}
        />
      )}
      {isOpenDelete && (
        <DeleteMenu
          isOpen={isOpenDelete}
          data={data}
          onClose={() => {
            setIsOpenDelete(false);
            setData([]);
          }}
        />
      )}
    </>
  );
}

export default MenuePage;
