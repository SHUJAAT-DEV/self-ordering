import { Card, Radio } from "antd";
import { useState } from "react";

const OrderCard = ({ details }: any) => {
  console.log("de", details);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const { table, menus, orderNumber, id } = details;
  let totalSubtotal = 0;
  return (
    <>
      <Card
        title="Running Order"
        extra={<a href="#">Print</a>}
        style={{ width: 280, height: 350, backgroundColor: "#f0f2f5" }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "80px" }}>
            Table No <b>2</b>
          </div>
          <div>
            Status <b>Running</b>
          </div>
        </div>

        <table>
          <tr>
            <th style={{ paddingRight: "15px" }}>Menu Item</th>
            <th style={{ paddingRight: "15px" }}>Price</th>
            <th style={{ paddingRight: "10px" }}>QTY</th>
            <th style={{ paddingRight: "10px" }}>Total Price</th>
          </tr>

          {menus.map((menu: any) => {
            const subtotal: number = menu.price * menu.quantity;
            totalSubtotal += subtotal;
            console.log("subtotal", subtotal);
            console.log("totalSubtotal", totalSubtotal);
            return (
              <tr key={menu.id}>
                <td>{menu.menueId.name}</td>
                <td>{menu.menueId.price}</td>
                <td>{menu.quantity}</td>
                <td>{subtotal}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={3}>
              <b>total</b>
            </td>

            <td>{totalSubtotal}</td>
          </tr>
        </table>
        <p>
          <b>Discount</b>
        </p>

        <Radio.Group>
          <Radio
            value="option1"
            checked={selectedOption === "option1"}
            onChange={handleOptionChange}
          >
            %
          </Radio>
          <Radio
            value="option2"
            checked={selectedOption === "option2"}
            onChange={handleOptionChange}
          >
            Fixed
          </Radio>
        </Radio.Group>
        {selectedOption === "option1" && (
          <input
            type="number"
            placeholder="Enter %"
            style={{ width: "120px" }}
          />
        )}

        {selectedOption === "option2" && (
          <input
            type="number"
            placeholder="Enter Amount"
            style={{ width: "120px" }}
          />
        )}

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "100px" }}>
            <b>Total Amount</b>
          </div>
          <div>2300</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button>Save</button>
        </div>
      </Card>
    </>
  );
};

export default OrderCard;
