import {
  Button,
  Col,
  Form,
  Input,
  List,
  Row,
  Select,
  Upload,
  Image,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import AddModal from "../../../UI/modal/AddModal";
import useMenue from "../hooks/useMenue";

type DeleteMenuProperties = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

function DeleteMenu({ isOpen, onClose, data }: DeleteMenuProperties) {
  const {
    deleteMenue,
    deleteMenueError,
    isLoadingdeleteMenue,
    deleteMenueSuccess,
  } = useMenue({
    menuId: data.id,
  });

  useEffect(() => {
    if (deleteMenueSuccess) {
      onClose();
    }
  }, [deleteMenueSuccess]);

  const onFinish = () => {
    deleteMenue();
  };

  return (
    <AddModal
      title={"Delete Menue"}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoadingdeleteMenue}
          disabled={isLoadingdeleteMenue}
          block
          form="basic"
        >
          Delete
        </Button>
      }
    >
      <Form
        name="basic"
        layout="vertical"
        style={{
          backgroundColor: "#ffffff",
          padding: 15,
          borderRadius: 10,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={24}>
            <p>Are you sure you want to delete this menue?</p>
          </Col>
        </Row>
      </Form>
    </AddModal>
  );
}

export default DeleteMenu;
