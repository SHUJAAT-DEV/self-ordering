const A4_HEIGHT_PX = 1170;
interface ReportProps {
  orders: any;
  fromDate: any;
  toDate: any;
}
const OrderReport = ({ orders, fromDate, toDate }: ReportProps) => {
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
  //TOTAL AMOUNT
  let totalAmount=0;
  
  orders?.map((order: any) => {
    totalAmount += Number(order.total);
  })
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        minHeight: `${A4_HEIGHT_PX}px`,
        padding: "0% 8% 0% 8%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4mm",
        }}
      >
        <img
          src="http://www.supah.it/dribbble/017/logo.png"
          alt="logo"
          style={{ width: "32px", height: "32px" }}
        />
        <div style={{ margin: "5px 0", fontSize: "12px", color: "#000" }}>
          {/* <p>Thank you for visiting from our hotel and for your order.</p> */}
        </div>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ color: "#ff0000", fontSize: "20px", margin: "0" }}>
            Lamstan Technologies
          </h1>
          <p style={{ margin: "5px 0", fontSize: "12px", color: "#000" }}>
            Lamstan technologies near National bank Aamdar chowk skardu
          </p>
        </div>
      </div>

      <section style={{ padding: "2mm", flexGrow: 1 }}>
        <p>
          From Date: <i>{fromDate}</i>
        </p>
        <p>
          To Date: <i>{toDate}</i>
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                width: "100px",
                borderBottom: "1px dashed black",
                color: "black",
              }}
            >
              <th style={{ textAlign: "left", color: "black" }}>
                Order Number
              </th>
              <th style={{ textAlign: "left", color: "black" }}>
                Table Number
              </th>
              <th style={{ textAlign: "left", color: "black" }}>Date & Time</th>
              <th style={{ textAlign: "left", color: "black" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((orders: any) => {
              return (
                <>
                <tr>
                  <td
                    style={{
                      width: "100px",
                      borderBottom: "1px dashed black",
                      paddingTop: "16px",
                      color: "black",
                    }}
                  >
                    {orders.invoiceNumber}
                  </td>
                  <td
                    style={{
                      width: "100px",
                      borderBottom: "1px dashed black",
                      color: "black",
                    }}
                  >
                    {orders.tableId.tableNumber}
                  </td>
                  <td
                    style={{
                      width: "100px",
                      borderBottom: "1px dashed black",
                      color: "black",
                    }}
                  >
                    {formatDate(orders?.orderDate)}
                  </td>
                  <td
                    style={{
                      width: "100px",
                      borderBottom: "1px dashed black",
                      color: "black",
                    }}
                  >
                    Rs.{orders?.total}
                    {/* {totalAmount=totalAmount+Number( orders?.total)} */}
                  </td>
                </tr>
                
                </>
                
                
              );
            })}
            <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <b>Total</b>
                    
                  </td>
                  <td><b>Rs.{totalAmount}</b></td>
                </tr>
          </tbody>
        </table>
      </section>

      {/* <footer style={{ textAlign: 'center', padding: '2mm', position: 'absolute', bottom: '0', width: '100%' }}>
        <img src="https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584088.jpg" alt="logo" style={{ width: '150px' }} />
        <p style={{ margin: '10px 0', fontSize: '12px', color: '#000' }}><a href="#" style={{ color: '#ff0000', textDecoration: 'none' }}>www.yourwebsite.com</a></p>
      </footer> */}
    </div>
  );
};

export default OrderReport;
