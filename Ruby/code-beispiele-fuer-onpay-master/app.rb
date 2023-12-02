require 'openssl'
require 'net/http'
require 'uri'
require 'sinatra'
require 'paypal-sdk-rest'
require 'certifi'

APP_ROOT = File.dirname(__FILE__)

ENV['SSL_CERT_FILE'] = Certifi.where

PayPal::SDK.configure(
  mode: 'sandbox',
  client_id: 'AQCpdZTL9Fi51eky04HnSdBMX8nPkxMlorBbuP5hFUBIOZ3NixERnEEteJ2mPizRfghKV0bivtMe5hF9',
  client_secret: 'EIjW9jBBBtv7dBpwMuE9VDt-EFraa1PexjrOdPS7hdWI-0d9z5lFIsBifpRy-4K_FAcr6zEP2Evmnxdw'
)

PayPal::SDK::Core::Config.configure do |config|
  config.ssl_options = {
    ca_file: File.join(APP_ROOT, 'cacert.pem'),
    ca_path: nil
  }
end

def create_payment
  payment = PayPal::SDK::REST::Payment.new(
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    transactions: [{
                     amount: { total: '10.00', currency: 'USD' },
                     description: 'Product Purchase'
                   }],
    redirect_urls: {
      return_url: 'http://localhost:4567/success',
      cancel_url: 'http://localhost:4567/cancel'
    }
  )
  if payment.create
    payment
  else
    error_details = payment.error.details.first
    error_code = error_details.issue
    error_message = error_details.description
    puts "Payment creation failed: Error Code #{error_code}, Message: #{error_message}"
  end
end

def execute_payment(payment_id, payer_id)
  payment = PayPal::SDK::REST::Payment.find(payment_id)

  if payment.execute(payer_id: payer_id)
    transaction = payment.transactions.first
    payment_id = transaction.related_resources.first.sale.id
    payment_amount = transaction.amount.total
    payment_currency = transaction.amount.currency

    "Payment successful! Payment ID: #{payment_id}, Amount: #{payment_amount} #{payment_currency}"
  else
    'Payment execution failed'
  end
end

get '/' do
  File.read(File.join(APP_ROOT, 'index.html'))
end

get '/buy' do
  payment = create_payment
  if payment && payment.links
    redirect payment.links.find { |link| link.method == 'REDIRECT' }.href
  else
    'Payment creation failed'
  end
end

get '/success' do
  payment_id = params['paymentId']
  payer_id = params['PayerID']

  execute_payment(payment_id, payer_id)
end

get '/cancel' do
  'Payment canceled'
end

Rack::Handler::WEBrick.run Sinatra::Application, Port: 4567

=begin
http://localhost:4567/
=end