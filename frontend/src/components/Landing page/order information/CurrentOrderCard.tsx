import { Button, Card } from "antd";
import AddModal from "../../UI/modal/AddModal";
import { BASE_URL } from "../../../api/http";
import "./orderInfo.css";

const calculateTotalBill = (orders: any[]) => {
    if (orders && orders.length === 0) return 0;
    return orders.reduce((acc, order) => {
        return acc + Number(order.menueId.price) * Number(order.quantity);
    }, 0);
};

interface ViewOrderCardProps {
    viewCard: boolean;
    setViewCard: any;
    currentOrder: any;
    tableNumber: string | undefined;
}

const mergeOrders = (orders: any) => {
    const mergedMenus: any = [];

    orders?.forEach((order: any) => {
        order.menus.forEach((menu: any) => {
            const existingMenu = mergedMenus.find(
                (m: any) => m.menueId.id === menu.menueId.id
            );

            if (existingMenu) {
                existingMenu.quantity += menu.quantity;
            } else {
                mergedMenus.push({
                    ...menu,
                    orderNumber: order.orderNumber,
                    orderStatus: order.orderStatus.name,
                });
            }
        });
    });

    return mergedMenus;
};

function ViewCurrentOrderCard({
    viewCard,
    setViewCard,
    tableNumber,
    currentOrder,
}: ViewOrderCardProps) {
    console.log("order-current", currentOrder);
    const mergedOrder = mergeOrders(currentOrder);

    return (
        <AddModal
            isOpen={viewCard}
            onClose={() => setViewCard(false)}
            title="Order Summary"
            footer={
                <>
                    {/* Add any footer buttons or actions here if needed */}
                </>
            }
        >
            {(
                <>
                    {mergedOrder.length === 0 ? (
                        <h1>Empty</h1>
                    ) : (
                        <div className="order-info-container">
                            {/* List Of Ordered menu */}
                            <div className="order-section">
                                <div className="current-order-container">
                                    {mergedOrder &&
                                        mergedOrder.map((order: any, index: any) => (
                                            <Card
                                                hoverable
                                                className="current-order-list"
                                                key={order.menueId.id}
                                            >
                                                <div className="ordered-items" style={{ justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <div className="orderlistTitle">
                                                            <img
                                                                src={BASE_URL + order.menueId.image}
                                                                alt={order.menueId.name}
                                                                className="orderListImage"
                                                            />
                                                        </div>
                                                        <div className="foodName">
                                                            <h4>{order.menueId.name}</h4>
                                                            <p>Status: {order.orderStatus}</p>
                                                        </div>
                                                    </div>

                                                    <div className="foodPrice">
                                                        <h4>Rs: {order.menueId.price}</h4>
                                                        <p>x {order.quantity}</p>
                                                    </div>
                                                </div>

                                                {/* <div className="quantity-container">
                          <button
                            // onClick={(event) => {
                            //   handleIncrementOrder(event, order);
                            // }}
                          >
                            +
                          </button>
                          <span>{order.quantity}</span>
                          <button
                            // onClick={(event) => {
                            //   handleDecrementOrder(event, order);
                            // }}
                          >
                            -
                          </button>
                        </div> */}
                                            </Card>
                                        ))}
                                </div>
                            </div>

                            {/* Payment */}
                            {mergedOrder.length > 0 && (
                                <div className="bill">
                                    <div className="billInfo">
                                        <div className="grandTotal">
                                            <h4 className="total">Sub total</h4>
                                            <h4 className="totalAmount">
                                                Rs: {calculateTotalBill(mergedOrder)}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </AddModal>
    );
}

export default ViewCurrentOrderCard;
