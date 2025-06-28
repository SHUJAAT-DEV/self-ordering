import React, { useEffect, useRef, useState } from "react";
import { Card, Spin, Carousel, Button } from "antd";
import { LoadingOutlined, LeftOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ViewOrderCard from "../order information/OrderInfo";
import useOrderStore from "../store/orderStore";
import useMenueScreen from "./hooks/useMenuScreen";
import "./mainMenu.css";
import menuImg from "./../../../assets/menu-img.png";
import { BASE_URL } from "../../../api/http";
import beepSound from "../../../assets/beeb (1).mp3";
import ViewCurrentOrderCard from "../order information/CurrentOrderCard";
import sliderImg1 from "../../../../public/slider1.jpg";
import sliderImg2 from "../../../../public/slider 2.jpg";
type MenuSection = "CATEGORY" | "MENU";

interface RouteParams {
  tableNumber: string;
}

const MainMenuContainer: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();

  const isValidTableNumber = (number: any): boolean => {
    //return number && !isNaN(number) && Number(number) > 0;
    return number;
  };

  if (!isValidTableNumber(tableNumber)) {
    return (
      <div
        style={{
          backgroundColor: "red",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        Error
      </div>
    );
  }

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [viewCard, setViewCard] = useState(false);
  const [viewCurrentOrder, setViewCurrentOrder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const menuListRef = useRef<HTMLDivElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);

  const {
    menueCategoryList,
    isLoadingCategory,
    menueList,
    getCurrentOrderByTableId,
    currentOrder,
  } = useMenueScreen({
    categoryId: selectedCategory,
  });

  const addOrder = useOrderStore((state) => state.addOrder);
  const { orders } = useOrderStore();

  const loadMoreItems = () => {
    const currentLength = menuItems.length;
    const moreItems = menuItems.slice(currentLength, currentLength + 12);
    setMenuItems(menuItems.concat(moreItems));
    if (menuItems.length + moreItems.length === menuItems.length) {
      setHasMore(false);
    }
  };

  const loadMoreCategory = () => {
    const currentLength = categoryItems?.length;
    const moreItems = categoryItems.slice(currentLength, currentLength + 8);
    setCategoryItems(categoryItems.concat(moreItems));
    if (categoryItems.length + moreItems.length === categoryItems.length) {
      setHasMore(false);
    }
  };

  const handleScroll = (
    event: React.UIEvent<HTMLDivElement>,
    type: MenuSection
  ) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      type === "CATEGORY" ? loadMoreCategory() : loadMoreItems();
    }
  };

  useEffect(() => {
    if (
      menueCategoryList &&
      menueCategoryList.length > 0 &&
      selectedCategory === null
    ) {
      setSelectedCategory(menueCategoryList[0].id);
    }
  }, [menueCategoryList]);

  const contentStyle: React.CSSProperties = {
    margin: 0,
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  const playBeep = (soundUrl: string) => {
    const audio = new Audio(soundUrl);
    audio.play();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };
  const handleAddClick = (item: any) => {
    addOrder(item);
    playBeep(beepSound);
    // playBeep('/another-beep.mp3'); // Path to another beep sound file in the public directory
    // speak('tea '); // Uncomment this line for voice feedback
  };
  console.log("currentorder", currentOrder);
  const location = useLocation();

  const tableId = location?.state;

  console.log("tableid", tableId);

  useEffect(() => {
    getCurrentOrderByTableId(tableId);
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/table-screen");
  };
  return (
    <>
      {/* <ArrowLeftOutlined/> */}
      <div className="main-menu-container">
        <div className="banner-section">
          <Carousel afterChange={onChange} autoplay>
            <div>
              <img src={sliderImg1} alt="banner" className="banner-image" />
              <h3 style={contentStyle}>1</h3>
            </div>
            <div>
              <img src={sliderImg2} alt="banner" className="banner-image" />
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <img src={sliderImg1} alt="banner" className="banner-image" />
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <img src={sliderImg2} alt="banner" className="banner-image" />
              <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel>
          <div className="bannerButtonContiner">
            <button className="goBackToTable" onClick={handleClick}>
              <LeftOutlined />
              Back
            </button>
            <button
              className="banner-order-view"
              onClick={() => setViewCurrentOrder(true)}
            >
              View Order
            </button>
            <button className="banner-button" onClick={() => setViewCard(true)}>
              Order {orders.length > 0 ? orders.length : ""}
            </button>
          </div>
        </div>
        <div className="menu-section">
          <div
            className="menu-category"
            ref={categoryListRef}
            onScroll={(event) => handleScroll(event, "CATEGORY")}
          >
            <p className='foodCatgory'>Menue Catagory</p>
            {
              isLoadingCategory ? (
                // <Spin />
                <Spin className='Loading-spiner' indicator={<LoadingOutlined style={{ fontSize: 48, color: "brown", position:"absolute", left:"50%" }} spin />} />
              ) : (
                <>
                  {menueCategoryList &&
                    menueCategoryList.filter((i: any) => i.isAvailable === true).map((item: any) => (
                      <div
                        className="category-item"
                        key={item.id}
                        onClick={() => setSelectedCategory(item.id)}
                      >
                        <img
                          src={BASE_URL + item?.image ?? menuImg}
                          alt={item.name}
                          className="category-item-image"
                          onError={(e) => (e.currentTarget.src = menuImg)}
                        />
                        <h3 className="category-item-name">{item.name}</h3>
                      </div>
                    ))}
              </>
            )}
          </div>

          <div
            className="menu-list"
            ref={menuListRef}
            onScroll={(event) => handleScroll(event, "MENU")}
          >
            {menueList &&
              menueList.map((item: any) => (
                <Card
                  key={item.id}
                  style={{ width: 200, height: 260 }}
                  cover={
                    <img
                      alt="example"
                      height={150}
                      src={BASE_URL + item?.image ?? menuImg}
                      onError={(e) => (e.currentTarget.src = menuImg)}
                    />
                  }
                >
                  <div className="menue-contents-container">
                    <Meta title={item.name} />
                    <Meta description={`Rs ${item.price}`} />
                  </div>
                  <div style={{ display: "flex", margin: "10px" }}>
                    <button
                      className="menu-item-button"
                      onClick={() => handleAddClick(item)}
                    >
                      Add
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
      {viewCard && (
        <ViewOrderCard
          tableNumber={tableNumber}
          viewCard={viewCard}
          setViewCard={setViewCard}
        />
      )}
      {viewCurrentOrder && (
        <ViewCurrentOrderCard
          currentOrder={currentOrder}
          tableNumber={tableNumber}
          viewCard={viewCurrentOrder}
          setViewCard={setViewCurrentOrder}
        />
      )}
    </>
  );
};

export default MainMenuContainer;
