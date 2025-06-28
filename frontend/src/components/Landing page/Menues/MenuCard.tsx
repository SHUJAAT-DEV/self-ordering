import { Button, Card, Layout } from "antd";
import useOrderStore from "../store/orderStore";
import useMenueScreen from "./hooks/useMenuScreen";
import "./menues.css";
import { BASE_URL } from "../../../api/http";
const { Content } = Layout;
const { Meta } = Card;
type menueListProperties = {
  data: any;
};
function MenuCard({ data }: menueListProperties) {
  const addOrder = useOrderStore((state) => state.addOrder);

  const categoryId = data.id;
  const { menueList } = useMenueScreen({
    categoryId,
  });
  return (
    <Content className="slider-content">
      {menueList &&
        menueList.map((item: any) => (
          <Card
            key={item.id}
            className="menu-card"
            style={{ width: 170 }}
            cover={<img alt="" src={BASE_URL + item.image} style={{ height: "22vh" }} />}
          >
            <Meta title={item.name} />
            <div className="cardFooter">
              <p className="cardPrice">RS: {item.price}</p>
              <Button
                className="menue-button"
                onClick={(event) => {
                  addOrder(item);
                }}
              >
                Add
              </Button>
            </div>
          </Card>
        ))}
    </Content>
  );
}

export default MenuCard;
