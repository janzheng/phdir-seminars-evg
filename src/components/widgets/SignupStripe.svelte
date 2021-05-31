

<div id="signup-container" class="_section-article _margin-center"> 
  <Formlet
    formData={formData} 
    showPageURL={false}
    on:update={(evt => {handleUpdate(evt.detail)})}
    on:clear={(() => {console.log('[testPaged] formlet cleared')})}
    bind:submitted={formSubmitted}
    bind:formState={formState} 
    bind:isValid={isValid} 
    bind:touched={touched} 
    on:submit={(evt => {handleSubmit(evt.detail)})}
  >
  
    <div slot="preCheckout">
      <div class="pricing _card _padding _color-bg-white">
        {#if ticketPrice > 0}
          <div class="_margin-bottom">
            Your final ticket price is ${ticketPrice} USD
          </div>

          {#if paymentKey}
            <div class="_margin-bottom">
              <div>
                <label class="_left" for="card-element">Credit Card</label>
                <div id="card-element" class="Stripe field input input_card _border-gr-icicle"></div>
                <div id="card-errors" class="Stripe-error" role="alert"></div>
                <div class="_font-small _padding-top-half">Payments powered by Stripe</div>
              </div>
            </div>
          {/if}

         {:else}
          Fill out the form to see your final price.
        {/if}
      </div>
    </div>


    <div slot="postCheckout">
      {#if errorMsg}
        <div class="_margin-top _card __error _padding">
          {errorMsg}
        </div>
      {/if}
    </div>
  </Formlet>
</div>


<script>

  // import { onMount } from 'svelte';

  import { formData } from "@/_data/formEvergreen.js";
  import Formlet from '@/components/formlet/FormletPaged.svelte'
  import { fetchPost } from '@/_utils/fetch-helpers'

	import { _contents } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"
  import { scrollToAnchor } from "@/_utils/scrollto.js";
  import { zzz } from "@/_utils/helpers.js";


  // grab content from Airtable
  const { signedup } = _contents(['signedup'])
  $: if(signedup) {
    formData['settings']['successText'] = textReplacer(signedup)
  }

  // default to disabled style
  // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive __disabled'


  export let formState, isValid, touched
  let resetForm, formSubmitted, formSubmitting
  
  let ticketPrice = -1, paymentKey = null, errorMsg


  const handleUpdate = async (data) => {

    let state = data.state

    // ticket prices should be hard coded
    // should also be coded again separately on server
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

    if (ticketPrice > 0) {

      const res = await fetch(
        `/api/payments/getters?position=${state.position}&tickettype=${state.tickettype}`, {
        method: 'GET',
      })
      if(res.ok) {
        let json = await res.json()
        paymentKey = json['paymentKey']
        initStripe()
      }
      // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive'
      // creates infinite loop: formData['settings']['successText'] = `Buy your ticket for ${ticketPrice} USD`
    }
  }

  const handleSubmit = async (data) => {

    let state = data.state

    if (process.browser) {
      // console.log('submitting data: ', data.state)
    }

    if(ticketPrice < 1) {
      // show error
      return
    }

    // intialize payment intent
    // const stripeIntent = await fetchPost('/api/payments/initialize', { state }, fetch)

/* 
    registration + payment flow: (works for Stripe and Paypal)

    1. [server] log registration in Airtable; generate ticket # etc.; payment status is "Pending"
    2. [server] generate payment intent and return key
    3. [client] use stripe key to complete payment
    4. [server] confirm payment status and add payment data and invoice #

    - tickets w/o credit card will remain as "Pending" — this helps with check payments
    - show in thank you message that payment didn't go through
    - multiple tries are ok!
*/

    const _res = await fetchPost('/api/setters', {data: data.state, type: 'signup'}, fetch)
    let signupData
    if(_res.status == 200) {
      let json = await _res.json()
      signupData = json['data']
      // console.log('User registered:', signupData)
    } else {
      console.error('submit error:', _res.status, _res)
      errorMsg = `Evergreen registration failed: ${_res.status}`
      throw new Error('Evergreen registration failed')
      return
    }
    

    // process Stripe payment here
    const stripePayment = await stripe.confirmCardPayment(signupData.paymentKey.client_secret, {
      payment_method: {
        card: card,
      }
    })
    // console.log('Stripe payment:', stripePayment)
    if (stripePayment.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.error(stripePayment.error.message);
      errorMsg = stripePayment.error.message

      throw new Error('Stripe payment failed')
      return
    } else if(stripePayment.paymentIntent.status) {

      // register completed payment w/ Airtable 
      const payConfirmRes = await fetchPost('/api/setters', { 
        data: {
          signupData, 
          paymentMethod: 'Stripe',
          paymentReceipt: stripePayment.paymentIntent.id,
        },
        type: 'post_payment'
      }, fetch)

      if(!payConfirmRes.ok) {
        console.error('Payment confirmation error:', payConfirmRes.status, payConfirmRes)
        errorMsg = `Evergreen payment failed, but your payment went through: ${payConfirmRes.status}`
        throw new Error('Evergreen payment failed, but your payment went through')
        return
      }
    }
    
    // submission complete; show thank you message
    // replace template text w/ state data

    formSubmitted=true
    formSubmitting=false
    const successText = textReplacer(signedup, {
      ...signupData,
      ticketnumber: signupData.ticketnumber,
    })
    formData['settings']['successText'] = successText
    zzz(scrollToAnchor, 'signup-container', 200)
    
  }











  // onMount(async () => {

  // })

  let stripe, elements, card
  const initStripe = () => {
    if(!stripe) {
      stripe=true
      let script = document.createElement('script')
      script.setAttribute('src', 'https://js.stripe.com/v3/')
      // get stripe pk value 
      script.onload = loadStripe
      document.head.appendChild(script)
    }
  }
 
  // Create and initialize a payment form object
  const loadStripe = () => {
    console.log('[Stripe] Loading')
    // Set your publishable key: remember to change this to your live publishable key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    stripe = Stripe(paymentKey);
    elements = stripe.elements();

    // Set up Stripe.js and Elements to use in checkout form
    const style = {
      base: {
        iconColor: '#666ee8',
        color: '#31325f',
        border: '3px solid red',
        fontWeight: 400,
        fontFamily:
          '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '18px',
        '::placeholder': {
          color: '#aab7c4',
        },
        ':-webkit-autofill': {
          color: '#666ee8',
        },
      },
    };

    card = elements.create("card", { 
      style: style,
      hidePostalCode: true,
    });
    card.mount("#card-element");

    card.on('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }
</script>


<style type="text/scss">

  .Stripe {
    padding-top: 0.6rem;
  }
</style>



