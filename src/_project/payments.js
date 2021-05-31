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


// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
import stripe from 'stripe'
const _stripe = stripe(process.env.STRIPE_SK, {apiVersion: ''});


// initiate a stripe payment intent
export async function createPayment(price, metadata, currency='usd') {
	if (price == 0)
		return undefined

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

  // if prices are correct, send Stripe public key
  // this is required to generate the Stripe payments fields
  if (ticketPrice > 0) {
    return process.env.STRIPE_PK
  }

  return null
}
