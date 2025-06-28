import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import AddModal from "../../../UI/modal/AddModal";
import useMenue from "../hooks/useOrder";
import useTable from "../hooks/useOrder";

type CreateOrderProperties = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

function CreateOrder({ isOpen, onClose, data }: CreateOrderProperties) {
  console.log("modal data", data);
  const { saveTable, setIsEdit, isLoading, isSuccess, isLoadingTable } =
    useTable({
      orderId: data.id,
    });
  // const { locationLists } = useLocation();
  const onFinish = (value: any) => {
    if (data.length !== 0) {
      console.log("data to send", value);
      setIsEdit(true);
      // username(data.id);
      saveTable(value);
    } else {
      saveTable(value);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const formInitialValues = {
    tableNumber: data.tableNumber,
    capacity: data.capacity,
    isReserve: data.isReserve,
  };
  const [value, setValue] = useState(true);
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  return (
    <AddModal
      title={data.length !== 0 ? "Update Table" : "Create Table"}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        data.length !== 0 ? (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingTable}
            disabled={isLoadingTable}
            block
            form="basic"
          >
            Update Table
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingTable}
            disabled={isLoadingTable}
            block
            form="basic"
          >
            Create Table
          </Button>
        )
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
        initialValues={formInitialValues}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Table Number"
              name="tableNumber"
              rules={[
                {
                  required: true,
                  message: "Please insert table number!",
                },
              ]}
            >
              <Input type="number" placeholder="Please insert table number!" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[
                {
                  required: true,
                  message: "Please insert capacity",
                },
              ]}
            >
              <Input type="number" placeholder="Please insert capacity" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            {data.length !== 0 ? (
              <Form.Item
                name="isReserve"
                label="Is Reserve"
                rules={[
                  {
                    required: false,
                    message: "Please select Table Availability",
                  },
                ]}
              >
                <Radio.Group
                //onChange={onChange}
                //value={value}
                //defaultValue="true"
                >
                  <Radio value={true}>
                    <b>Yes</b>
                  </Radio>
                  <Radio value={false}>
                    <b>No</b>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <Form.Item
                name="isReserve"
                label="Is Reserve"
                initialValue={false}
                rules={[
                  {
                    required: false,
                    message: "Please select Table Availability",
                  },
                ]}
              >
                <Radio.Group
                //onChange={onChange}
                //value={value}
                //defaultValue="true"
                >
                  <Radio value={true}>
                    <b>Yes</b>
                  </Radio>
                  <Radio value={false}>
                    <b>No</b>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </AddModal>
  );
}

export default CreateOrder;
