import { Button, Col, Form, Input, Row, Select } from "antd";
import { useEffect, useMemo } from "react";
import AddModal from "../../../UI/modal/AddModal";
import useUser from "../hooks/useUser";

type CreateUserProperties = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

function CreateUser({ isOpen, onClose, data }: CreateUserProperties) {
  console.log("modal data", data);
  const { saveUser, isSuccess, roleList, setIsEdit, username, isLoadingUser } =
    useUser({ userId: data.id });

  // const { locationLists } = useLocation();
  const onFinish = (value: any) => {
    if (data.length !== 0) {
      console.log("data to send", value);
      setIsEdit(true);
      // username(data.id);
      saveUser(value);
    } else {
      saveUser(value);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);
  // const locations = useMemo(
  //   () =>
  //     locationLists?.map((item: any) => ({ value: item.id, label: item.name })),
  //   [locationLists]
  // );

  const formInitialValues = {
    username: data?.username,
    email: data?.email,
    contact: data?.contact,
    password: data?.password,
    roleId: data?.roleId?.id,
  };
  return (
    <AddModal
      title={data.length !== 0 ? "Update User" : "Create User"}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        data.length !== 0 ? (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingUser}
            disabled={isLoadingUser}
            block
            form="basic"
          >
            Update User
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingUser}
            disabled={isLoadingUser}
            block
            form="basic"
          >
            Create User
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
            {data.length !== 0 ? (
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input disabled placeholder="Please input your username" />
              </Form.Item>
            ) : (
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Please input your username" />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: false,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input placeholder="Please input your email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="contact"
              rules={[
                {
                  required: false,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input type="text" placeholder="xxx-xxxxx" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Role"
              name="roleId"
              rules={[
                {
                  required: true,
                  message: "Please enter role!",
                },
              ]}
            >
              <Select
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={roleList?.map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))}
                defaultValue={
                  roleList.find(
                    (item: any) =>
                      item?.name.toString().toLowerCase() === "display only"
                  )?.id
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AddModal>
  );
}

export default CreateUser;
