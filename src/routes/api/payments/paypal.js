


// doesn't work, too complicated



// import checkoutNodeJssdk from '@paypal/checkout-server-sdk'



// /**
//  *
//  * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
//  * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
//  *
//  */
// function environment() {
//     let clientId = process.env.PAYPAL_CLIENT
//     let clientSecret = process.env.PAYPAL_SECRET

//     return new checkoutNodeJssdk.core.SandboxEnvironment(
//         clientId, clientSecret
//     );
// }






// // 1b. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
// /**
//  *
//  * PayPal HTTP client dependency
//  */
// const payPalClient = checkoutNodeJssdk.core.PayPalHttpClient(environment())




// // 2. Set up your server to receive a call from the client
// export async function post(req, res) {

//   // 2a. Get the order ID from the request body
//   const orderID = req.body.orderID;

//   // 3. Call PayPal to capture the order
//   const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
//   request.requestBody({});

//   try {
//     const capture = await payPalClient.client().execute(request);

//     // 4. Save the capture ID to your database. Implement logic to save capture to your database for future reference.
//     const captureID = capture.result.purchase_units[0]
//         .payments.captures[0].id;
//    // await database.saveCaptureID(captureID);

//   } catch (err) {

//     // 5. Handle any errors from the call
//     console.error(err);
//     return res.send(500);
//   }

//   // 6. Return a successful response to the client
//   res.send(200);
// }