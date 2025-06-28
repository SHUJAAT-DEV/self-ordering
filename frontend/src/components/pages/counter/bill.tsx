import logo from '../../../../public/quita.jpg'


interface BillProps {
  orderDetails: any;
  totalPrice: any;
  finalPrice: any;
}
const Bill: React.FC<BillProps> = ({
  orderDetails,
  totalPrice,
  finalPrice,
}) => {
  console.log("bill on", orderDetails);
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, "0");

    // Format the date as "YYYY-MM-DD HH:mm:ss"
    return `${day}/${month}/${year} at ${formattedHours}:${minutes} ${ampm}`;
  };
  return (
    <>
      <div style={{ width: "100mm", height: "150mm", padding: "2mm" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "4mm",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: "32px", height: "32px" }}
          />
          <div style={{ margin: "5px 0", fontSize: "12px", color: "#000" }}>
            {/* <p>Thank you for visiting from our hotel and for your order.</p> */}
          </div>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ color: "#ff0000", fontSize: "20px", margin: "0" }}>
              Invoice
            </h1>
            <p style={{ margin: "5px 0", fontSize: "12px", color: "#000" }}>
              Order Number# <b>{orderDetails?.orderNumber}</b>
            </p>
            <p style={{ margin: "5px 0", fontSize: "12px", color: "#000" }}>
              {formatDate(orderDetails?.orderDate)}
            </p>
          </div>
        </div>

        <section style={{ backgroundColor: "#ffffff", padding: "2mm" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ borderBottom: "1px solid #DDD" }}>
              <tr>
                <th style={{ textAlign: "left", width: "40%" }}>Item</th>
                <th style={{ textAlign: "left" }}>Price/item</th>
                <th style={{ textAlign: "left" }}>Quantity</th>
                <th style={{ textAlign: "left" }}>Price</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails?.menus?.map((menue: any) => {
                return (
                  <tr>
                    <td
                      style={{
                        width: "100px",
                        paddingTop: "16px",
                      }}
                    >
                      {menue.menueId.name}
                    </td>
                    <td style={{ width: "100px" }}>{menue.menueId.price}</td>
                    <td style={{ width: "100px" }}>{menue.quantity}</td>
                    <td style={{ width: "100px" }}>
                      {Number(menue.menueId.price) * Number(menue.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td
                  style={{
                    borderBottom: "1px solid #DDD",
                    borderTop: "1px solid #DDD",
                    paddingTop: "16px",
                    width: "40%",
                  }}
                >
                  Sub Total
                </td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                >
                  Rs. {totalPrice}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                >
                  Discount
                </td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                >
                  Rs. {totalPrice - finalPrice ?? 0}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                ></td>
                <td
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #DDD",
                    paddingTop: "16px",
                  }}
                >
                  Rs. {finalPrice}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div
          style={{
            textAlign: "center",
            backgroundColor: "#ffffff",
            padding: "2mm",
          }}
        >
          <p style={{ margin: "10px 0", fontSize: "12px", color: "#000" }}>
            Have a nice day.
          </p>
          {/* <img
            src="https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584088.jpg"
            alt="logo"
            style={{ width: "150px" }}
          /> */}
          <p style={{ margin: "10px 0", fontSize: "12px", color: "#000" }}>
            {/* <a href="#" style={{ color: "#ff0000", textDecoration: "none" }}>
              www.yourwebsite.com
            </a> */}
          </p>
        </div>
      </div>
    </>
  );
};
export default Bill;
