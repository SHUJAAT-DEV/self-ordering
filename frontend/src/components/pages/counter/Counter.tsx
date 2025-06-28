import React, { useEffect, useState } from "react";
import "./counter.css";
import useActiveOrder from "../order/hooks/useActiveOrder";
import { ORDER_STATUS } from "../../../utils/status.enum";
import { Card } from "antd";
import OrderCard from "./OrderCard";
import { BASE_URL } from "../../../api/http";

const orderDetails = {
  items: [
    { name: "Burger", price: "$5.00" },
    { name: "Fries", price: "$2.50" },
    { name: "Coke", price: "$1.50" },
  ],
  totalPrice: "$9.00",
  discount: "$1.00",
};

function mergeMenuItems(order:any) {
  const mergedMenus = order.menus.reduce((acc:any, menuItem:any) => {
      const menueId = menuItem.menueId.id;
      if (!acc[menueId]) {
          acc[menueId] = { ...menuItem, quantity: 0 };
      }
      acc[menueId].quantity += menuItem.quantity;
      return acc;
  }, {});

  order.menus = Object.values(mergedMenus);
  return order;
}
function CounterScreen() {
  const { getOrderByStatus, isLoading, orderData } = useActiveOrder();

  useEffect(() => {
    const eventSource = new EventSource(
      BASE_URL+"/sse/stream"
    );
    eventSource.onmessage = function (event) {
      getOrderByStatus(ORDER_STATUS.SERVED);
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    getOrderByStatus(ORDER_STATUS.SERVED);
  }, []);

  console.log("orderData", orderData);

  return (
    <div className="counter-container">
      {console.log("order details", orderData)}
      {orderData &&
        orderData.map((order: any) => <OrderCard orderDetails={mergeMenuItems(order)} />)}
    </div>
  );
}

export default CounterScreen;
