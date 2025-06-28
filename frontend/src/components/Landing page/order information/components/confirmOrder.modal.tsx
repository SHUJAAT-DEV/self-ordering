import { Button, Col, Form, Input, Radio, Row, Select, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import AddModal from "../../../UI/modal/AddModal";

import { UploadOutlined } from "@ant-design/icons";
import useMenue from "../../../pages/menue/hooks/useMenue";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
type ConfirmOrderModalProperties = {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  isloading?: boolean;
};

function ConfirmOrderModal({
  isOpen,
  onClose,
  orderNumber,
  isloading,
}: ConfirmOrderModalProperties) {
  return (
    <AddModal
      isOpen={isOpen}
      onClose={onClose}
      isloading={isloading} title={""}  
      footer={
        <Button
          type="primary"
          loading={isloading}
          disabled={isloading}
          block
        >
          Ok
        </Button>
      }
      >
      <div style={{ display: "flex", alignItems: "center" ,flexDirection:"column" }}>
        <p style={{ margin: 0, marginRight: "5px" }}>
          Your order is placed successfully with Order Number 
        </p>
        <h1 style={{ margin: 0 ,fontSize:"6em" }}>{orderNumber}</h1>
      </div>
    </AddModal>
  );
}

export default ConfirmOrderModal;
