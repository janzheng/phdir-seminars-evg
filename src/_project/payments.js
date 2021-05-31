/*

	- accepting payments
		- https://stripe.com/docs/payments/accept-a-payment

	- collect addresses:
		- https://stripe.com/docs/payments/checkout/customization

	- demo:
		- https://stripe-payments-demo.appspot.com/

	- intents (save card to charge later)
		- https://stripe.com/docs/payments/save-and-reuse
*/



import { config } from "dotenv";
config(); // https://github.com/sveltejs/sapper/issues/122



// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
import stripe from 'stripe'
// const _stripe = process.env.STRIPE_SK ? stripe(process.env.STRIPE_SK, {apiVersion: ''}) : null
const _stripe = process.env.PAYMENT_MODE == 'STRIPE' ? stripe(process.env.STRIPE_SK, {apiVersion: ''}) : null





// initiate a stripe payment intent
export async function createStripePayment(price, metadata, currency='usd') {
	if (price == 0 || !_stripe) {
    console.error('[createStripePayment] Could not create stripe payment')
		return undefined
  }

	return await _stripe.paymentIntents.create({
	  amount: price * 100, // turn into cents
	  currency: currency,
	  // Verify your integration in this guide by including this parameter
	  metadata
	});
}


export let getTicketPrice = (state) => {

  let ticketPrice = -1
  if(state.position === 'Student'  && state.tickettype === 'In-Person' )
    ticketPrice = 150
  else if(state.position === 'Student'  && state.tickettype === 'Virtual' )
    ticketPrice = 50
  else if(state.position === 'Academic'  && state.tickettype === 'In-Person' )
    ticketPrice = 250
  else if(state.position === 'Academic'  && state.tickettype === 'Virtual' )
    ticketPrice = 100
  else if(state.position === 'Industry'  && state.tickettype === 'In-Person' )
    ticketPrice = 400
  else if(state.position === 'Industry'  && state.tickettype === 'Virtual' )
    ticketPrice = 300

  return ticketPrice
}


// get prices and Stripe secret for starting Stripe payment
export async function prePayment(state) {
  let ticketPrice = getTicketPrice(state)
  console.log('[prePayment] queries:', state, ticketPrice)

  // if prices are correct, send Stripe or Paypal public key
  // this is required to generate the Stripe or Paypal payments fields
  if (ticketPrice > 0) {
    return process.env.PAYMENT_MODE=='STRIPE' ? process.env.STRIPE_PK : process.env.PAYPAL_CLIENT
  }

  return null
}
