import React, { useRef, useEffect } from "react";

export default function Paypal() {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "EUR",
                  value: 65.00,
                },
              },
            ],
          });
            },
        // onApprove: async (data, actions) => {
        //   const order = await actions.order.capture();
        //   console.log(order);
        // },

        onApprove: async (data, actions) => {
            try {
              const order = await actions.order.capture();
              console.log('Payment captured:', order);
              // Print specific order details
              console.log('Order ID:', order.id);
              console.log('Status:', order.status);
              console.log('Amount:', order.purchase_units[0].amount.value);
              console.log('Currency:', order.purchase_units[0].amount.currency_code);
              // ...print other relevant order details
              
            } catch (error) {
              console.error('Error capturing payment:', error);
            }
          },
    
        
      /*   onError: (err) => {
          console.log(err);
        }, */

      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}