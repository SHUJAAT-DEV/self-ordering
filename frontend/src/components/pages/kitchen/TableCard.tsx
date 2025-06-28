import React, { useState } from "react";
import { Card, Modal, Button, List, Typography } from "antd";
import useActiveOrder from "../order/hooks/useActiveOrder";
import { ORDER_STATUS } from "../../../utils/status.enum";
const { Title, Text } = Typography;

const getRandomColor = (id: any) => {
  const letters = "0123456789ABCDEF";
  let hash = 0;

  // Create a hash from the ID
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert the hash to a color
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[(hash >> (i * 4)) & 0xf];
  }

  return color;
};

const TableCard = ({ details }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { updateOrderStatus } = useActiveOrder();

  const { table, menus, orderNumber, id } = details;

  console.log("table", menus, details);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // update the status of order
    updateOrderStatus({ orderId: id, status: ORDER_STATUS.SERVED });

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div key={orderNumber}>
      <Card
        bordered={false}
        className="table-card"
        onClick={showModal}
        style={{ backgroundColor: getRandomColor(table?.id) }}
      >
        <h1> Table# {table?.tableNumber}</h1>
      </Card>

      <Modal
        title={`Details for Table ${table?.tableNumber}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Order is Ready
          </Button>,
        ]}
      >
        {/* {menus.map((menu: any) => (
          <div key={menu.id} className="menu-container">
            <p>{menu.menueId.name}</p>
            <p>{menu.quantity}</p>
          </div>
        ))} */}

        <List
          dataSource={menus}
          header={
            <List.Item>
              <Text>Name</Text>
              <Text>Quantity</Text>
            </List.Item>
          }
          renderItem={(item: any) => (
            <List.Item>
              <Text>{item.menueId.name}</Text>
              <Text>{item.quantity}</Text>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default TableCard;
