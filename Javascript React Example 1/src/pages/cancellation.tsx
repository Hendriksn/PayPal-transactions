import React from 'react';

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
};

export default function CancellationPage() {
    return (
        <div style={containerStyle}>
            <h1 style={{ marginBottom: "20px" }}>Transaction Canceled</h1>
            <br/>
            <p>Sorry, your PayPal transaction has been canceled.</p>
        </div>
    );
}
