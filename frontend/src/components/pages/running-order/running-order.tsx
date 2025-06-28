import React, { useEffect, useState } from "react";
import { Card, Space, Radio } from "antd";
import useOrder from "../order/hooks/useOrder";
import "./order.css";
import useActiveOrder from "../order/hooks/useActiveOrder";
import { ORDER_STATUS } from "../../../utils/status.enum";
import OrderCard from "./OrderCard";
import { BASE_URL } from "../../../api/http";

function RunningOrder() {
  const { getOrderByStatus, isLoading, orderData } = useActiveOrder();
  console.log("orderData", orderData);

  useEffect(() => {
    getOrderByStatus(ORDER_STATUS.RUNNING);
    const eventSource = new EventSource(
       BASE_URL +"/sse/stream"
    );
    eventSource.onmessage = function (event) {
      console.log("event", event.data);
      //   setSelectedOption("TEST");

      //getNewOder with status confirm and update the orderList
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="running-order-container">
      {orderData &&
        orderData.map((order: any) => <OrderCard details={order} />)}
    </div>
  );
}

export default RunningOrder;
