from flask import Flask, render_template, jsonify, request
import paypalrestsdk

app = Flask(__name__)

paypalrestsdk.configure({
  "mode": "sandbox", # sandbox or live
  "client_id": "AdgENBo3rjdPaWBuAOwT4PJalkgdKCRch9kVGIrL_mF8y3EliAZMSBlPApQ5QanrJ4CU0NRG_eSIBfRj",
  "client_secret": "ELRvE2T5Nj3S8g9A5JIQnRJzSk-eioSn9q9Xe1qVK7O6KWqtNMZSEgdvbLGrkEIKcf6BtBMlkuYnRHNU" })

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/payment', methods=['POST'])
def payment():

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment/execute",
            "cancel_url": "http://localhost:3000/"},
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "testitem",
                    "sku": "12345",
                    "price": "500.00",
                    "currency": "USD",
                    "quantity": 1}]},
            "amount": {
                "total": "500.00",
                "currency": "USD"},
            "description": "This is the payment transaction description."}]})

    if payment.create():
        print('Payment success!')
        print(payment.id)
    else:
        print(payment.error)

    return jsonify({'paymentID' : payment.id})

@app.route('/execute', methods=['POST'])
def execute():
    success = False

    payment = paypalrestsdk.Payment.find(request.form['paymentID'])

    if payment.execute({'payer_id' : request.form['payerID']}):
        print('Execute success!')
        print("PaymentID: ",payment.id)
        print("Status: ", payment.status)
        print("State: ",payment.state)
        print("Intent: ", payment.intent)
        print("Payer ID: ", payment.payer.payer_info.payer_id)
        print("Payer Email: ", payment.payer.payer_info.email)
        print("EC-Token:", payment.links[0].href.split("=")[-1])
        success = True
    else:
        print(payment.error)

    return jsonify({'success' : success})

if __name__ == '__main__':
    app.run(debug=True)