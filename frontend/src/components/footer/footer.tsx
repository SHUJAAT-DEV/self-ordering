import React from 'react';
import foodLogo from '../../../public/quita.jpg'

const PageFooter: React.FC = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10%", paddingBottom: "10px" }}>
            <img style={{ width: "100px" }} src={foodLogo} />
            <h2 style={{
                fontWeight: 'bold',
                color: 'brown',
                fontSize: '36px'
            }}> QUETTA DEWAN CAFE</h2>
        </div>
    );
}

export default PageFooter;
