import { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import { Currency } from "./Currency.enum";

/**
 * Creates a PayPal order with amount of 1.99 in default currency.
 *
 * @param _data
 * @param {CreateOrderActions} actions
 * @returns {Promise<string>}
 */
export function createOrder(_data: CreateOrderData, actions: CreateOrderActions): Promise<string> {
    console.log("in create order");
    return actions.order.create({
        purchase_units: [
            {
                items: [{
                    name: "Tabasco",
                    quantity: "1",
                    unit_amount: {
                        currency_code: Currency.EURO,
                        value: "1.99"
                    }
                }],
                amount: {
                    currency_code: Currency.EURO,
                    value: "1.99",
                    breakdown: {
                        item_total: {
                            currency_code: Currency.EURO,
                            value: "1.99"
                        }
                    }
                },
            },
        ],
    });

}
