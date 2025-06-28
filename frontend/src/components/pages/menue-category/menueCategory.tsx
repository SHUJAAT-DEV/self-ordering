import { Button, Input, Table, Tooltip, Image } from "antd";
import { useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { Menue, MenueCategory } from "../../../api/request";
import useMenueCategory from "./hooks/useMenueCategory";
import CreateMenueCategory from "./components/CreateMenuCategory";
import { BASE_URL } from "../../../api/http";
import DeleteMenuCategory from "./components/DeleteMenuCategory";

function MenueCategoryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const { menueCategoryList, isLoading } = useMenueCategory({});

  const [filteredRows, setFilteredRows] = useState(menueCategoryList);
  const handleSearch = debounce((event) => {
    const term = event.target.value;
    const filtered = menueCategoryList.filter((user_list: any) =>
      user_list?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRows(filtered);
  }, 700);
  const handleEdit = async (id: any) => {
    const response = await MenueCategory.getById(id);
    setData(response.data);
    setIsOpen(true);
  };
  const handleDelete = async (id: any) => {
    const response = await MenueCategory.getById(id);

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
            <h1>Menue Category</h1>
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
            Add Menue Category
          </Button>
        </div>
      </div>

      <Table
        columns={column}
        dataSource={filteredRows ? filteredRows : menueCategoryList}
        loading={isLoading}
      />

      {isOpen && (
        <CreateMenueCategory
          isOpen={isOpen}
          data={data}
          onClose={() => {
            setIsOpen(false);
            setData([]);
          }}
        />
      )}
      {isOpenDelete && (
        <DeleteMenuCategory
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

export default MenueCategoryPage;
