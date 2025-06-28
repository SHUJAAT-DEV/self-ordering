import { Button, Col, Form, Input, Layout, Row, Typography } from "antd";
import signinbg from "../../../assets/images/logo.png";
import useAuth from "./hooks/useAuth";
import { setPageTitle } from "../../../utils/titleUtils";
import { useEffect } from "react";

const { Title } = Typography;
const { Content } = Layout;

function SignIn() {
  const { login, isLoggingIn, loginError } = useAuth();
  useEffect(() => {
    setPageTitle("Login -HMS");
    return () => setPageTitle("HMS");
  }, []);

  return (
    <Layout className="layout-default layout-signin">
      <Content className="signin">
        <Row gutter={[24, 0]} justify="space-around">
          <Col
            xs={{ span: 24, offset: 0 }}
            lg={{ span: 6, offset: 2 }}
            md={{ span: 12 }}
          >
            <Title className="mb-15">Sign In</Title>
            <Title className="font-regular text-muted" level={5}>
              Enter your username and password to sign in
            </Title>
            <Form onFinish={login} layout="vertical" className="row-col">
              <Form.Item
                className="username"
                label="User name"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Enter user name" />
              </Form.Item>

              <Form.Item
                className="username"
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Col>
                {!!loginError && (
                  <p style={{ color: "red" }}>
                    Username and password is not correct
                  </p>
                )}
              </Col>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isLoggingIn}
                >
                  SIGN IN
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col
            className="sign-img"
            style={{ padding: 12 }}
            xs={{ span: 24 }}
            lg={{ span: 12 }}
            md={{ span: 12 }}
          >
            <img src={signinbg} alt="" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default SignIn;
