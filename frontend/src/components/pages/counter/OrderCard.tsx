import React, { useEffect, useState } from "react";
import { Card, List, Typography, Row, Col, Button, Radio, Input } from "antd";
import useActiveOrder from "../order/hooks/useActiveOrder";
import { ORDER_STATUS } from "../../../utils/status.enum";
import "./counter.css";
import ReactDOM from "react-dom";
import Bill from "./bill";
import useOrder from "../order/hooks/useOrder";
import { Orders } from "../../../api/request";


const { Title, Text } = Typography;
interface Menu {
  id: string;
  image: string;
  price: string;
  name: string;
}

interface Table {
  capacity: number;
  id: string;
  isReserved: boolean;
  tableNumber: number;
}

interface Item {
  id: string;
  menueId: Menu;
  quantity: number;
}

interface OrderDetails {
  id: string;
  menus: Item[];
  orderNumber: string;
  table: Table;
}

interface OrderCardProps {
  orderDetails: OrderDetails;
}
function mergeMenuItems(order: any) {
  const mergedMenus = order.menus.reduce((acc: any, menuItem: any) => {
    const menuId = menuItem.menueId.id;
    const price = parseFloat(menuItem.menueId.price);

    if (!acc[menuId]) {
      acc[menuId] = {
        ...menuItem,
        amount: menuItem.quantity * price
      };
    } else {
      acc[menuId].quantity += menuItem.quantity;
      acc[menuId].amount += menuItem.quantity * price;
    }
    return acc;
  }, {});

  return {
    ...order,
    menus: Object.values(mergedMenus)
  };
}


const OrderCard: React.FC<OrderCardProps> = ({ orderDetails }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const handleKeyUp = (optionalValue?: string) => (event: any) => {
    const typedValue = event.currentTarget.value;
    const total_price = calculateTotalPrice();
    if (optionalValue === "per") {
      // console.log("ggg", total_price);
      const calculatedPercentage = (typedValue / 100) * total_price;
      setTotalAmount(total_price - calculatedPercentage);
    } else {
      const calculatedFixedValue = total_price - typedValue;
      setTotalAmount(calculatedFixedValue);
    }
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  const { menus, table, id } = orderDetails;
  const discountedPrice = 12.0;
  const { updateOrderStatus } = useActiveOrder();
  const { getOrderBill, orderBillData, getOrderBillSuccess, getOrderLoading } =
    useOrder({});

  const handleOk = (orderId: any) => {
    //getOrderBill(orderId);
    printContent(orderId);
    updateOrderStatus({ orderId: id, status: ORDER_STATUS.COMPLETE });
  };
  const printContent = async (orderId: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Hotel</title></head><body>"
      );
      printWindow.document.write('<div id="print-content"></div>');
      const response = await Orders.getOrderBill(orderId);
      // Render your PrintView component inside the new window
      console.log("data-bill", response?.data)
      const mergedOrderMenu = mergeMenuItems(response?.data)
      console.log("final", mergedOrderMenu);
      ReactDOM.render(
        <Bill
          orderDetails={mergedOrderMenu}
          totalPrice={calculateTotalPrice()}
          finalPrice={totalAmount ? totalAmount : calculateTotalPrice()}
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
  // useEffect(() => {
  //   if (orderBillData && getOrderLoading) {
  //     printContent();
  //   }
  // }, [orderBillData, getOrderLoading]);
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    menus.forEach((menu) => {
      console.log(menu);
      totalPrice += parseInt(menu.menueId.price) * menu.quantity;
    });
    return totalPrice;
  };

  console.log("order", orderDetails)

  return (
    <div id={`order-${orderDetails.id}`} style={{ width: "fit-content" }} >
      <Card style={{ minWidth: "30vw" }}>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={4} style={{ margin: "5px 0" }}>Table #{table.tableNumber}</Title>
          <Title level={4} style={{ margin: "5px 0" }}>Invoice #{orderDetails?.orderNumber}</Title>
        </div>
        <hr />
        <List style={{height:"300px", paddingRight: "5%", overflow: "auto"}}
          dataSource={menus}
          header={
            <List.Item>
              <Text style={{ width: "100px" }}>Name</Text>
              <Text>Price</Text>
              <Text>Quantity</Text>
              <Text>Price</Text>
            </List.Item>

          }
          renderItem={(item: any) => (
            <List.Item>
              <Text style={{ width: "100px"  }}>{item.menueId.name}</Text>
              <Text>{item.menueId.price}</Text>
              <Text>{item.quantity}</Text>
              <Text>{item.quantity * item.menueId.price}</Text>
            </List.Item>
          )}
        />
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Text>Sub Total Price</Text>
          <Text>Rs {calculateTotalPrice()}</Text>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <Text>Discount</Text>
          {/* <Text>Rs {discountedPrice}</Text> */}
        </div>
        <div style={{ display: "flex" }}>

          <Radio.Group>
            <div>

              <Radio
                value="per"
                checked={selectedOption === "per"}
                onChange={handleOptionChange}
              >
                Percentage %
              </Radio>
              <Radio
                value="fixed"
                checked={selectedOption === "fixed"}
                onChange={handleOptionChange}
              >
                Fixed Amount
              </Radio>
            </div>

          </Radio.Group>

          {selectedOption === "per" && (
            <Input
              type="number"
              placeholder="Enter Discount Amount in %"
              max={100}
              // style={{ width: "220px" }} 
              onKeyUp={handleKeyUp(selectedOption)}
            />
          )}

          {selectedOption === "fixed" && (
            <Input
              type="number"
              placeholder="Enter Discount Amount"
              // style={{ width: "220px", marginLeft: "75px" }}
              onKeyUp={handleKeyUp(selectedOption)}
            />
          )}
        </div>


        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text>Total Price</Text>
          <Text style={{ fontWeight: 700 }}>
            Rs {totalAmount ? totalAmount : calculateTotalPrice()}
          </Text>
        </div>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => handleOk(orderDetails.id)}>
            Complete order
          </Button>
        </Row>
      </Card>
    </div>
  );
};

export default OrderCard;
