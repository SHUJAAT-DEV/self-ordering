import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            ©2023 made with by
            <a href="#" className="font-weight-bold" target="_blank">
              Hotel Managment System by LTS
            </a>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
