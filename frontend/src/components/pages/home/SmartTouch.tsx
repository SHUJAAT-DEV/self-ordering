import {
  MobileOutlined,
  ReloadOutlined,
  RetweetOutlined,
  ShakeOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
} from "antd";
import './smartTouch.css';

function SmartTouch() {
  return (
    <>
      <div className="layout-content">
        <Card
          title="Show Me Ticket"
          bordered={false}
        >
          <Row gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}>
            <Col xs={24} sm={16} >
              <div className="touch-buttons">
                <Row>
                  <Col sm={4} xs={6} offset={4}>
                    <Button size={'large'}>
                      $1
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $2
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $3
                    </Button>
                  </Col >
                </Row>
                <Row>
                  <Col sm={4} xs={6} offset={4}>
                    <Button size={'large'}>
                      $5
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $7
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $10
                    </Button>
                  </Col >
                </Row>
                <Row>
                  <Col sm={4} xs={6} offset={4}>
                    <Button size={'large'}>
                      $20
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $30
                    </Button>
                  </Col>
                  <Col sm={4} xs={6} >
                    <Button size={'large'}>
                      $50
                    </Button>
                  </Col >
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <Space
                direction="vertical"
                style={{
                  width: '100%',
                }}
              >
                <Button icon={<MobileOutlined />} block>Show Game</Button>
                <Button icon={<ShakeOutlined />} block>Show Ticket</Button>
                <Button icon={<RetweetOutlined />} block>Jackpot</Button>
                <Button icon={<ReloadOutlined />} block>Refresh All</Button>
              </Space>
            </Col>
          </Row>

        </Card>
      </div>
    </>

  );
}
export default SmartTouch;