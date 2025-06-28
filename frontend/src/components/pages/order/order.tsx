import {
  Badge,
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";

import {
  EditOutlined,
  FilterOutlined,
  PrinterOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { TableApi } from "../../../api/request";
import CreateOrder from "./components/CreateOrder";
import useOrder from "./hooks/useOrder";
import moment from "moment";
import OrderReport from "./components/order.report";
import ReactDOM from "react-dom";
const { RangePicker } = DatePicker;
// import { Column } from "@ant-design/plots";

function OrderPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const { orderList, isLoading, filterOrders, filteredOrders } = useOrder({});

  const [filteredRows, setFilteredRows] = useState(orderList);
  //console.log("list", menueList[0].personId[0].firstName);
  const handleSearch = debounce((event) => {
    const term = event.target.value;
    const filtered = orderList.filter((user_list: any) =>
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
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Table Number",
      dataIndex: "tableNumber",
      sorter: (a:any, b:any) => a.tableNumber - b.tableNumber,
      render: (_: any, record: any) => {
        return record?.tableId?.tableNumber;
      },
      
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      render: (_: any, record: any) => {
        return moment(record?.orderDate).format("MMM-DD-YYYY");
      },
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      render: (_: any, record: any) => {
        //return record?.orderStatusId?.name;
        return record?.orderStatusId?.name === "running" ? (
          <Tag color="#108ee9">{record?.orderStatusId?.name}</Tag>
        ) : record?.orderStatusId?.name === "complete" ? (
          <Tag color="#87d068">{record?.orderStatusId?.name}</Tag>
        ) : record?.orderStatusId?.name === "cancel" ? (
          <Tag color="#f50">{record?.orderStatusId?.name}</Tag>
        ) : (
          ""
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: (_: any, record: { id: any }) => (
    //     <>
    //       <Tooltip placement="top" title="Edit">
    //         <EditOutlined
    //           onClick={() => handleEdit(record.id)}
    //           //style={{ color: "#00a678" }}
    //         />{" "}
    //       </Tooltip>
    //     </>
    //   ),
    // },
  ];
  const [orders, setOrders] = useState(orderList);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const initialOrders = orders != undefined ? orders : filteredOrders;
  const filterInventory =
    initialOrders != undefined ? initialOrders : orderList;
  const handleDateRange = (value: any) => {
    setFromDate(String(moment(value[0].$d).format("YYYY-MM-DD")));
    setToDate(String(moment(value[1].$d).format("YYYY-MM-DD")));
    const data = {
      status: status,
      fromDate: String(moment(value[0].$d).format("YYYY-MM-DD")),
      toDate: String(moment(value[1].$d).format("YYYY-MM-DD")),
      //userId: String(localStorage.getItem("userId")),
    };
    setOrders(filteredOrders);
    filterOrders(data);
  };

  useEffect(() => {
    setOrders(filteredOrders);
  }, [filteredOrders]);

  const printReport = () => {
    const printWindow = window.open("", "_blank");
    // Check if the print window is opened successfully
    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Lotv</title></head><body>"
      );
      printWindow.document.write('<div id="print-content"></div>');

      // Render your PrintView component inside the new window
      ReactDOM.render(
        <OrderReport
          orders={filteredOrders?.data}
          fromDate={fromDate}
          toDate={toDate}
        />,
        printWindow.document.getElementById("print-content")
      );

      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open a new window for printing.");
    }
  };
  return (
    <>
      <div className="set-btn-onConer">
        <div>
          <label>
            <h1>Orders</h1>
          </label>
        </div>
        <div className="location-action">
          <Row gutter={24}>
            <Col span={16}>
              <RangePicker
                onChange={handleDateRange}
              // onOpenChange={() => {
              //   setFromDate("");
              //   setToDate("");
              // }}
              />
            </Col>

            <Col span={8}>
              <Button icon={<PrinterOutlined />} onClick={printReport} block>
                Print
              </Button>
            </Col>
          </Row>
          <Input
            className="Search-btn"
            placeholder="Search here..."
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
        </div>
      </div>

      <Table
        columns={column}
        //dataSource={filteredRows ? filteredRows : orderList}
        dataSource={filteredOrders?.data ?? orderList}
        loading={isLoading}
      />

      {isOpen && (
        <CreateOrder
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

export default OrderPage;
