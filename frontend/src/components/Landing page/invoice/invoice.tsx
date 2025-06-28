import React from 'react';
import logo from "../../../../public/quita.jpg"

const Invoice = () => {
    return (
        <div style={{ width: '100mm', height: '150mm', padding: '2mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',padding: '4mm' }}>
                <img src={logo} alt="logo" style={{ width: '32px'}} />
                <div style={{ margin: '5px 0', fontSize: '12px', color: '#000' }}>
                    {/* <p>Thank you for visiting from our hotel and for your order.</p> */}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ color: '#ff0000', fontSize: '20px', margin: '0' }}>Invoice</h1>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#000' }}>ORDER# 800025</p>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#000' }}>MARCH 4TH 2016</p>
                </div>
            </div>

            <section style={{ padding: '2mm' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{ width: '100px', borderBottom: '1px solid black', color:'black' }}>
                            <th style={{ textAlign: 'left',color:'black'}}>Item</th>
                            <th style={{ textAlign: 'left',color:'black'}}>Order No</th>
                            <th style={{ textAlign: 'left',color:'black'}}>Quantity</th>
                            <th style={{ textAlign: 'left',color:'black'}}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',paddingTop: '16px',color:'black' }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing</td>
                            <td style={{ width: '100px', borderBottom: '1px solid black', color:'black' }}>MH792AM/A</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black'}}>1</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black'}}>$100</td>
                        </tr>
                        <tr>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black', paddingTop: '16px' }}>Bryani</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black',paddingTop: '16px' }}>MH792AM/A</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black',paddingTop: '16px' }} >1</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black',paddingTop: '16px' }} >$299.95</td>
                        </tr>
                        <tr>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }}>Dicount</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }}></td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }} ></td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }} >$599.95</td>
                        </tr>
                        <tr>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }}>Sub Total</td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }}></td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }} ></td>
                            <td  style={{ width: '100px', borderBottom: '1px solid black',color:'black' ,paddingTop: '16px' }} >$599.95</td>
                        </tr>
                   
                    </tbody>
                </table>
            </section>

            <div style={{ textAlign: 'center', padding: '2mm' }}>
                <p style={{ margin: '10px 0', fontSize: '12px', color: '#000' }}>Have a nice day.</p>
                {/* <img src="https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584088.jpg" alt="logo" style={{ width: '150px' }} /> */}
                <p style={{ margin: '10px 0', fontSize: '12px', color: '#000' }}><a href="#" style={{ color: '#ff0000', textDecoration: 'none' }}>www.yourwebsite.com</a></p>
            </div>
        </div>
    );
};

export default Invoice;
