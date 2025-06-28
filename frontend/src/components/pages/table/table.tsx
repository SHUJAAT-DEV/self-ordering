import { Button, Input, Table, Tooltip } from "antd";
import { useState } from "react";

import {
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import CreateTable from "./components/CreateTable";
import useTable from "./hooks/useTable";
import { TableApi } from "../../../api/request";
// import { Column } from "@ant-design/plots";

function TablePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const { tableList, isLoading } = useTable({});

  const [filteredRows, setFilteredRows] = useState(tableList);
  //console.log("list", menueList[0].personId[0].firstName);
  const handleSearch = debounce((event) => {
    const term = event.target.value;
    const filtered = tableList.filter((user_list: any) =>
      user_list?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRows(filtered);
  }, 700);
  const handleEdit = async (id: any) => {
    const response = await TableApi.getById(id);
    console.log("yes", response);
    setData(response.data);
    setIsOpen(true);
  };
  // const handleDelete = async (id: any) => {
  //   const response = await Customer.getById(id);

  //   setData(response.data);
  //   setIsOpenDelete(true);
  // };

  const column: any = [
    {
      title: "Table Number",
      dataIndex: "tableNumber",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
    },
    {
      title: "Is Reserve",
      dataIndex: "isReserve",
      render: (_: any, record: any) => {
        return record?.isReserve === true ? "Yes" : "No";
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
        </>
      ),
    },
  ];

  // useEffect(() => {
  //   setPageTitle("Customers -Trango Adventures");
  //   return () => setPageTitle("Trango Adventures");
  // }, [customerList]);
  return (
    <>
      <div className="set-btn-onConer">
        <div>
          <label>
            <h1>Tables</h1>
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
            Add Table
          </Button>
        </div>
      </div>

      <Table
        columns={column}
        dataSource={filteredRows ? filteredRows : tableList}
        loading={isLoading}
      />

      {isOpen && (
        <CreateTable
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

export default TablePage;
