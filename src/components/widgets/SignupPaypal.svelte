


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
        {#if ticketPrice > 0 && $isValid == true}
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

         {:else}
          Fill out the form to see your final price and complete checkout.
        {/if}

        <div class=" {ticketPrice > 0 && $isValid == true? '':'_none'}" id="paypal-button-container"></div>
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

  import { onMount } from 'svelte';

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
  
  let ticketPrice = -1, paymentKey = null, errorMsg, state


  const handleUpdate = async (data) => {

    state = data.state

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

    // this checker required for Stripe, but not for Paypal
    // if (ticketPrice > 0 && $isValid == true) {

      // const res = await fetch(
      //   `/api/payments/getters?position=${state.position}&tickettype=${state.tickettype}`, {
      //   method: 'GET',
      // })
      // if(res.ok) {
      //   let json = await res.json()
      //   paymentKey = json['paymentKey']
      //   initPaypal()
      // }
      // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive'
      // creates infinite loop: formData['settings']['successText'] = `Buy your ticket for ${ticketPrice} USD`
    // }
  }

  const handleSubmit = async (data) => {

  }









  onMount(async () => {
    // load payment key on site load — speeds things up
    const res = await fetch(
      `/api/payments/getters`, {
      method: 'GET',
    })
    if(res.ok) {
      let json = await res.json()
      paymentKey = json['paymentKey']
      initPaypal()
    }
  })



  let hasPaypal, elements, card, confirmingPayment=false, confirmedPayment=false
  const initPaypal = () => {
    if(!hasPaypal) {
      console.log('[starting paypal...]')
      let script = document.createElement('script')
      script.setAttribute('src', `https://www.paypal.com/sdk/js?client-id=${paymentKey}`)
      // get stripe pk value 
      script.onload = loadPayPal
      document.head.appendChild(script)
      hasPaypal=true
    }
  }


  // Create and initialize a payment form object
  const loadPayPal = () => {
    console.log('[PayPal] Loading', paypal)

    paypal.Buttons({
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: ticketPrice
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // console.log('[paypal...]')

        // This function captures the funds from the transaction.
        return actions.order.capture().then(async function(details) {
          // This function shows a transaction success message to your buyer.

          confirmingPayment = true

          // register completed payment w/ Airtable 
          const payConfirmRes = await fetchPost('/api/setters', { 
            data: {
              ...state, 
              paymentMethod: 'PayPal',
              paymentReceipt: details.id,
              paymentReceiptData: details,
            },
            type: 'post_payment'
          }, fetch)

          if(!payConfirmRes.ok) {
            console.error('Payment confirmation error:', payConfirmRes.status, payConfirmRes)
            errorMsg = `Evergreen payment failed, but your payment went through: ${payConfirmRes.status}`
            throw new Error('Evergreen payment failed, but your payment went through')
            return
          }

          formSubmitted=true
          formSubmitting=false

          let json = await payConfirmRes.json(), signupData
          signupData = json['data']
          // console.log('>>>', signupData)

          const successText = textReplacer(signedup, {
            ...signupData,
            ticketnumber: signupData.ticketnumber,
          })
          formData['settings']['successText'] = successText
          confirmingPayment = false
          confirmedPayment = true
          zzz(scrollToAnchor, 'signup-container', 200)
          
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



