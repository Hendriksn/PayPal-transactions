import { useRouter } from 'next/router'; // Import the router from Next.js
import { createOrder } from "@/lib/createOrder.function";
import { onApprove } from "@/lib/onApprove.function";
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import {Currency} from "../lib/Currency.enum";

export default function Home(): JSX.Element {
    const router = useRouter(); // Initialize the router

    // Function to handle transaction cancellation
    const oncancel = () => {
        // Redirect to the cancellation page
        router.push('/cancellation');
    };

    console.log("PAYPAL_CLIENT_ID", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "FEHLER!")
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>

            <PayPalScriptProvider  options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                currency: Currency.EURO
            }}>
                <PayPalButtons style={{ layout: "horizontal", color: "blue", width: "auto", height: 55 }}
                               createOrder={createOrder}
                               onApprove={onApprove}
                               onCancel={oncancel} // Use the onCancel function here
                />

            </PayPalScriptProvider>
        </div>
    );
}
