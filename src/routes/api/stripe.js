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


import send from '@polka/send';
import Cytosis from 'cytosis';
import NodeCache from 'node-cache'
import { config } from "dotenv";
import shortid from 'shortid';

import _ from 'lodash'

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
import stripe from 'stripe'
const _stripe = stripe(process.env.STRIPE_SK, {apiVersion: ''});


import { checkEmailUser } from './preorder.js';
import { getProducts } from './content.js';
import { notifyAdmins, sendReceipt } from '../../_helpers/_notify.js';



const nodecache = new NodeCache()



export const calcPrice = (numOrders, user, product) => {

	let price
	// if(country === 'Canada')
	// 	price = product.fields['CAD']
	// else
	// 	price = product.fields['USD']

  let calcDiscount = 0 // discount per disc
  if(user && user.referrals && user.referrals.length > 0) {
    calcDiscount = user.referrals.length * 5

    if(calcDiscount > product.fields['CAD'] / 2)
      calcDiscount = product.fields['CAD'] / 2
  }

  let calcSubtotal = 0
  if(numOrders || product.fields['CAD']) {
    calcSubtotal = numOrders * product.fields['CAD']
  }

  let calcTotal = 0
  if(calcDiscount || numOrders) {
    const price = product.fields['CAD']
    calcTotal = numOrders * (price - calcDiscount)

    if (calcTotal < 0)
      calcTotal = 0
  }

  return {
  	calcDiscount: calcDiscount * numOrders, // discount per ALL discs
  	calcSubtotal,
  	calcTotal
  }
}


async function createPayment(price, orders, user, orderId, currency='cad') {
	if (price == 0)
		return undefined

  // console.log('user:', user) 

	return await _stripe.paymentIntents.create({
	  amount: price * 100, // turn into cents
	  currency: currency,
	  // Verify your integration in this guide by including this parameter
	  metadata: {
      email: user.fields['Email'],
      order_id: orderId,
      num_orders: orders,
      referral_count: user.referrals ? user.referrals.length : 0,
      referrals: user.referrals ? JSON.stringify(user.referrals) : 'no referrals',
    },
	});
}




async function logOrder(stripe, user, orderId, orders, totals) {
	console.log('PAYMENT SUCCESSFUL / STRIPE DATA:', stripe, user, orderId)

	const apiEditorKey = process.env.CHINOOK_AIRTABLE_PRIVATE_API
	const baseId = process.env.CHINOOK_AIRTABLE_PRIVATE_BASE
	// console.log(' >>>>>> totals >>>', totals)
	// validate?

  const saveToCytosis = async () => {
    return Cytosis.save({
      apiKey: apiEditorKey,
      baseId: baseId,
      tableName: 'Orders',
      tableOptions: {
        insertOptions: ['typecast'],
      },
      payload: {
      	Name: stripe.paymentIntent.shipping.name,
        Email: user.fields.Email,
        OrderStatus: ['New'],
        Address: JSON.stringify(stripe.paymentIntent.shipping.address),
        StripeId: stripe.paymentIntent.id,
        Signup: user.id,
        orderId: orderId,
        Total: stripe.paymentIntent.amount / 100,
        Subtotal: totals.calcSubtotal,
        Discount: totals.calcDiscount,
        NumOrders: orders,
        ReferralCount: user.referrals ? user.referrals.length : 0,
        Referrals: user.referrals ? JSON.stringify(user.referrals) : 'no referrals',
      }
    })
  }

  return saveToCytosis().then((_res) => {
  	// console.log('saveToCytosis >>> ', _res)
  	return _res
  })
}





















export async function get(req, res) {
  const { orders, email, productSlug, country } = req.query;

  try {

    async function getPrices() {
      const user = await checkEmailUser(email)
      const products = await getProducts()
      const product = products.filter(_product => {
        return _product.fields['Slug'] == productSlug
      })[0]

      // console.log('get payment for: ', orders, email, product)
      const {calcDiscount, calcSubtotal, calcTotal} = calcPrice(orders, user, product, country)
      // console.log('totes: ', calcDiscount, calcSubtotal, calcTotal)


      const orderId = shortid.generate()
      const intent = await createPayment(calcTotal, orders, user, orderId)
      // console.log('Stripe intent:', intent)
      send(res, 200, JSON.stringify({
        client_secret: intent ? intent.client_secret : null,
        orderId,
        calc: {
          calcDiscount, 
          calcSubtotal, 
          calcTotal,
        },
      }))
    }


    // if email exists, get prices for the use w/ that email
    if(email) {
      const dev = _.debounce(getPrices, 600, { 'maxWait': 1000 })()
    } else {
      // get the pk value otherwise
      send(res, 200, JSON.stringify({
        stripe_pk: process.env.STRIPE_PK
      }))
    }

  } catch(e) {
    console.error('[api/stripe/get]', e)
    send(res, 500, JSON.stringify(e));
  }
}


export async function post(req, res) {

	const { stripe, user, orderId, orders, totals } = req.body;
  try {

    stripe['orderId'] = orderId

  	const order = await logOrder(stripe, user, orderId, orders, totals)
  	await notifyAdmins(stripe, user, order)

    // console.log('orders:', order)
  	await sendReceipt(stripe, user, order)

		res.writeHead(200, { 'Content-Type': 'application/json' })
  	res.end() // tada

  } catch(e) {
    console.error('[api/square/post]', e)
    send(res, 500, JSON.stringify(e));
  }
}





