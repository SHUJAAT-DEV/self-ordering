import React from 'react';

const A4_HEIGHT_PX = 1170;

const SaleStatement = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: `${A4_HEIGHT_PX}px`, padding: '0% 8% 0% 8%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4mm' }}>
        <img src="http://www.supah.it/dribbble/017/logo.png" alt="logo" style={{ width: '32px', height: '32px' }} />
        <div style={{ margin: '5px 0', fontSize: '12px', color: '#000' }}>
          {/* <p>Thank you for visiting from our hotel and for your order.</p> */}
        </div>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ color: '#ff0000', fontSize: '20px', margin: '0' }}>Lamstan Technologies</h1>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#000' }}>Lamstan technologies near National bank Aamdar chowk skardu</p>
        </div>
      </div>

      <section style={{ padding: '2mm', flexGrow: 1 }}>
        <p>From Date: <i>9th Oct, 2024</i></p>
        <p>To Date: <i>9th Oct, 2024</i></p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ width: '100px', borderBottom: '1px dashed black', color: 'black' }}>
              <th style={{ textAlign: 'left', color: 'black' }}>Order Number</th>
              <th style={{ textAlign: 'left', color: 'black' }}>Table Number</th>
              <th style={{ textAlign: 'left', color: 'black' }}>Date</th>
              <th style={{ textAlign: 'left', color: 'black' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '100px', borderBottom: '1px dashed black', paddingTop: '16px', color: 'black' }}>
                Order20Lts2024
              </td>
              <td style={{ width: '100px', borderBottom: '1px dashed black', color: 'black' }}>MH792AM/A</td>
              <td style={{ width: '100px', borderBottom: '1px dashed black', color: 'black' }}>9th Oct, 2024</td>
              <td style={{ width: '100px', borderBottom: '1px dashed black', color: 'black' }}>$100</td>
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

export default SaleStatement;
