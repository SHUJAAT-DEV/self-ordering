import { Button, Card } from "antd";
import { useState } from "react";
import useOrderStore from "../store/orderStore";
import ConfirmOrderModal from "./components/confirmOrder.modal";
import useOrderInfo from "./hooks/useOrderInfo";
import Icon, { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "./orderInfo.css";
import AddModal from "../../UI/modal/AddModal";
import { BASE_URL } from "../../../api/http";
import { size } from "lodash";

const calculateTotalBill = (orders: any[]) => {
  if (orders && orders.length === 0) return 0;
  return orders.reduce((acc, order) => {
    return acc + Number(order.item.price) * Number(order.quantity);
  }, 0);
};

interface ViewOrderCardProps {
  viewCard: boolean;
  setViewCard: any;
  tableNumber: string | undefined;
}

function ViewOrderCard({
  viewCard,
  setViewCard,
  tableNumber,
}: ViewOrderCardProps) {
  const { orders, updateOrder, resetOrder } = useOrderStore();
  const { placedOrderData, isLoadingOrder, placeOrder, orderReset } =
    useOrderInfo({});

  const handleIncreamentOder = (event: any, order: any) => {
    event.preventDefault();
    updateOrder(order.item, order.quantity + 1);
  };
  const handleDecreamentOder = (event: any, order: any) => {
    event.preventDefault();
    updateOrder(order.item, order.quantity - 1);
  };

  const handleOrderComplete = () => {
    resetOrder();
    orderReset();
    setViewCard(false);
  };
  return (
    <AddModal
      isOpen={viewCard}
      onClose={() => setViewCard(false)}
      title="Order Summary"
      footer={
        <>
          {orders.length > 0 && (
            <Button
              type="primary"
              block
              className="primary-button"
              onClick={() => {
                !placedOrderData
                  ? placeOrder({ orders, tableNumber })
                  : handleOrderComplete();
              }}
              loading={isLoadingOrder}
            >
              {placedOrderData ? "Done" : "Confirm Order"}
            </Button>
          )}
        </>
      }
    >
      {!!placedOrderData ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p style={{ margin: 0, marginRight: "5px" }}>
            Your order is placed successfully with Order Number
          </p>
          <h1 style={{ margin: 0, fontSize: "6em" }}>{placedOrderData}</h1>
        </div>
      ) : (
        <>
          {orders.length === 0 ? (
            <h1>Empty</h1>
          ) : (
            <div className="order-info-container">
              {/* List Of Ordered menu */}
              <div className="order-section">
                <div className="current-order-container">
                  {orders &&
                    orders.map((order, index) => (
                      <Card
                        hoverable
                        className="current-order-lsist"
                        key={Math.random() + index}
                      >
                        <div className="ordered-items">
                          <div className="orderlistTitle">
                            <img
                              src={BASE_URL + order.item.image}
                              alt=""
                              className="orderListImage"
                            />
                          </div>
                          <div className="foodName">
                            <h4>{order.item.name}</h4>
                            <p>Rs:{order.item.price}</p>
                          </div>
                        </div>
                        <div className="quantity-container">
                          <  PlusCircleOutlined style={{ color: "red", fontSize: "20px" }}
                            onClick={(event) => {
                              handleIncreamentOder(event, order);
                            }}
                          />
                          <span>{order.quantity} </span>
                          <MinusCircleOutlined style={{ color: "red", fontSize: "20px" }}
                            onClick={(event) => {
                              handleDecreamentOder(event, order);
                            }}
                          />
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Payment */}
              {orders.length > 0 && (
                <div className="bill">
                  <div className="billInfo">
                    <div className="grandTotal">
                      <h4 className="total">Sub total </h4>
                      <h4 className="totalAmount">
                        Rs: {calculateTotalBill(orders)}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AddModal>
  );
}

export default ViewOrderCard;
