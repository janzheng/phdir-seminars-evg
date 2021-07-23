
{#if ticketPrice > 0}
  <div id="signup-finalize" class="{classes}">

    <div class="pricing _card _padding _color-bg-white">
      <div class="_margin-bottom">
        <div class="_card _padding __flat">
          <p>
            <strong>Your final registration fee is ${ticketPrice} USD</strong>
          </p><p>
            Please note that this price does not include your hotel room or abstract poster printing fees.
          </p>

        </div>
      </div>

      {#if paymentKey}
        {#if !hasPaypal}
          <div class="_margin-bottom">Loading PayPal checkout</div>
        {:else if confirmingPayment}
          <div class="_margin-bottom">Confirming PayPal payment</div>
        {:else}
          <!-- do nothing — paypal button should be hidden until needed -->
        {/if}
      {/if}

      <div class="" id="paypal-button-container"></div>

      {#if errorMsg}
        <div class="Error">
          <p>{errorMsg}</p>
          <p>If you continue getting this error, please take a screenshot and email it to Jan, at jan@phage.directory</p>
        </div>
      {/if}
    </div>

  </div>

{/if}




<script>

  import { onMount } from 'svelte';

  import { formData } from "@/_data/formEvergreen.js";
  import Formlet from '@/components/formlet/FormletPaged.svelte'
  import { fetchPost } from '@/_utils/fetch-helpers'
  // import { _err, _msg, _tr } from '@/_utils/sentry-browser'

	import { _contents } from "@/stores/sitedata"
	import { Profile } from "@/stores/profile"

  import { scrollToAnchor } from "@/_utils/scrollto.js";
  import { zzz } from "@/_utils/helpers.js";
  import { niceTimeDate } from '@/_utils/date'
  import log from '@/_utils/logger'

  import logstream from '@/_utils/logger-stream'
  import { trail } from '@/_utils/logger-trails'

	// import { textReplacer } from "@/_project/app-helpers"
  // import { prefetch, goto } from '@sapper/app';



  // grab content from Airtable
  // const { signedup } = _contents(['signedup'])
  // $: if(signedup) {
  //   formData['settings']['successText'] = textReplacer(signedup)
  // }

  // default to disabled style
  // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive __disabled'

  export let classes, user

  let formSubmitted, formSubmitting
  let ticketPrice = -1, paymentKey = null, errorMsg
  let sentryTransaction

  // test trail
  log.log(`hey this is a test`, {ex: 'some test data'})
  trail(`hey this is a test`, {ex: 'some test data'})
  

  $: if(user) {

    // ticket prices should be hard coded
    // should also be coded again separately on server
    if(user.position === 'Student'  && user.tickettype === 'In-Person' )
    ticketPrice = 150
    else if(user.position === 'Student'  && user.tickettype === 'Virtual' )
    ticketPrice = 50
    else if(user.position === 'Academic'  && user.tickettype === 'In-Person' )
    ticketPrice = 250
    else if(user.position === 'Academic'  && user.tickettype === 'Virtual' )
    ticketPrice = 100
    else if(user.position === 'Industry'  && user.tickettype === 'In-Person' )
    ticketPrice = 400
    else if(user.position === 'Industry'  && user.tickettype === 'Virtual' )
    ticketPrice = 300

    preInitPaypal()
  }


  async function preInitPaypal() {
    // gets the payment keys from server for Paypal to start working

    if(!paymentKey) {
      // load payment key on site load — speeds things up
      const res = await fetch(
        `/api/payments/getters`, {
        method: 'GET',
      })
      if(res.ok) {
        let json = await res.json()
        paymentKey = json['paymentKey']
      }
    }
  }

  // only init Paypal when both user and server payment key exists
  // safeguard against race cond
  $: if(user && paymentKey) {
    initPaypal()
  }

  let hasPaypal, elements, card, signupData, confirmingPayment=false, confirmedPayment=false
  const initPaypal = () => {
    if(!hasPaypal && user && paymentKey) {
      console.log(`[starting paypal...] with ${paymentKey}`)
      let script = document.createElement('script')
      script.setAttribute('src', `https://www.paypal.com/sdk/js?client-id=${paymentKey}&currency=USD`)
      // get stripe pk value 
      script.onload = loadPayPal
      document.head.appendChild(script)
      hasPaypal=true
      log.log('[initPaypal] w/user:', user)
    }
  }  


  // Create and initialize a payment form object
  const loadPayPal = () => {
    console.log('[PayPal] Loading', paypal, niceTimeDate(new Date()))

    paypal.Buttons({
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            custom_id: `${user.ticketnumber} | ${user.recordId}`,
            // payee: {
            //   email: user.ticketnumber,
            // }, 
            // shipping: {
            //   name: user.name
            // },
            amount: {
              value: ticketPrice,
              USD: 1,
            },
            invoice_id: `${user.name} - ${user.email} - ${user.ticketnumber} - ${niceTimeDate(new Date())}`
          }]
        });
      },
      onShippingChange: function(data,actions){
        return actions.resolve(); // https://github.com/paypal/paypal-checkout-components/issues/1521
      },
      onClick: function(err) {
        logstream.log('SignupFinalizePaypal', `Starting payment: ${user.name} - ${user.email}`, user)
        // _msg(`[Paypal-Finalize] Starting Payment: ${user.name} | ${user.email} | $${ticketPrice}`)
        // sentryTransaction = _tr({
        //   op: 'paypal-finalize',
        //   name: `Paypal finalize for ${user.name} | ${user.email}`
        // })
      },
      onError: function(err) {
        // this is a generic error / last resort error — handle these in onApprove !ok
        // when onApprove throws an error, we end up here
        // errors caught in !payConfirmRes.ok
        // console.error('We were unable to register your payment. If this error persists, please email jan@phage.directory. Error message:', err)
        logstream.error('SignupFinalizePaypal', `Starting payment: ${user.name} - ${user.email}`, user, err)
        errorMsg = `We were unable to register your payment. If this error persists, please email jan@phage.directory.`
        sentryTransaction.finish()
      },
      onApprove: function(data, actions) {
        // console.log('[paypal...]')

        // This function captures the funds from the transaction.
        return actions.order.capture().then(async function(details) {
          // This function shows a transaction success message to your buyer.


          if (details && details.error === 'INSTRUMENT_DECLINED') {
            // _msg(`[Paypal-Finalize] Card declined for: ${user.name} | ${user.email} | $${ticketPrice}`)
            logstream.error('SignupFinalizePaypal', `Card declined: ${user.name} - ${user.email}`, user)
            return actions.restart()
          }
          
          confirmingPayment = true
          
          user['email'] = user['email'] ? user['email'].trim() : ''

          // console.log('pp details:' , details)
          logstream.error('SignupFinalizePaypal', `Payment approved for: ${user.name} - ${user.email}`, user)
          
          // register completed payment w/ Airtable 
          const payConfirmRes = await fetchPost('/api/setters', { 
            data: {
              ...user, 
              paymentMethod: 'PayPal',
              paymentReceipt: details.id,
              paymentReceiptData: details,
              regstatus: ['Attendee'],
            },
            type: 'update_payment'
          }, fetch)

          
          if(!payConfirmRes.ok) {
            signupData = await payConfirmRes.json()
            // _msg(`[Paypal-Finalize] Data Capture Error: ${payConfirmData?.error} — ${user.name} | ${user.email} — ${payConfirmRes.status}` )
            // console.error('Payment confirmation error:', signupData?.error, payConfirmRes.status)
            // errorMsg = `We were unable to register your payment, but your payment went through. We have been notified and are looking into it. ${json?.error}`
            
            logstream.error('SignupFinalizePaypal', `Payment/user update failed: ${user.name} - ${user.email}`, user)
            throw new Error('Evergreen registration failed')
            return
          }

          logstream.error('SignupFinalizePaypal', `Payment + user update success: ${user.name} - ${user.email}`, user)
          zzz(scrollToAnchor, 'top', 200)

          formSubmitted=true
          formSubmitting=false
          
          signupData = await payConfirmRes.json()
          
          // const successText = textReplacer(signedup, {
          //   ...signupData,
          //   ticketnumber: signupData.ticketnumber,
          // })
          // formData['settings']['successText'] = successText

          confirmingPayment = false
          confirmedPayment = true

          // store this for login
          Profile.set(signupData)

          // update user for binding
          user = signupData

          // await prefetch(`/start/${signupData.ticketnumber}`)
          console.log('Payment confirmation for user:', user)
          sentryTransaction.finish()

          // if(process.browser)
          //   _msg(`[Paypal-Finalize] Confirmed: ${user.name} | ${user.email} | ${user.ticketnumber} | ${details.id}`)

          // goto(`/start/${signupData.ticketnumber}`)
          
        })
      }
    }).render('#paypal-button-container');
  }
 
</script>


<style type="text/scss">

  // hide submit button for Paypal
  // .Stripe {
  //   padding-top: 0.6rem;
  // }
</style>



