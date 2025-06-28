import React, { useEffect, useState } from "react";
import "./kitchen.css";
import { Carousel,Empty } from 'antd';
import useActiveOrder from "../order/hooks/useActiveOrder";
import { ORDER_STATUS } from "../../../utils/status.enum";
import TableCard from "./TableCard";
import { BASE_URL } from "../../../api/http";
import slider1 from '../../../../public/slider1.jpg'
import slider2 from '../../../../public/slider 2.jpg'
import PageFooter from '../../footer/footer';

function KitchenScreen() {
  const { getOrderByStatus, isLoading, orderData } = useActiveOrder();

  useEffect(() => {
    const eventSource = new EventSource(
      BASE_URL + "/sse/stream"
    );
    eventSource.onmessage = function (event) {
      getOrderByStatus(ORDER_STATUS.RUNNING);
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    getOrderByStatus(ORDER_STATUS.RUNNING);
  }, []);

  return (
    <div>
      <PageFooter/>
      {/* <Carousel afterChange={() => { }} autoplay>
        <div>
          <img
            src={slider1}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
            src={slider2}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
            src={slider1}
            alt="banner"
            className="banner-image"
          />
        </div>
        <div>
          <img
            src={slider2}
            alt="banner"
            className="banner-image"
          />
        </div>
      </Carousel> */}
<div className="kitchen-container">
  {orderData && orderData.length > 0 ? (
    orderData.map((order: any) => <TableCard key={order.id} details={order} />)
  ) : (
    <div style={{position:"relative", top:"50%", left:"100%", fontSize:"200px"}}>
    < Empty/>
    </div>

  )}
</div>
    </div>
  );
}

export default KitchenScreen;
