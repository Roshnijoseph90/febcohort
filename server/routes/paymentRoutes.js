import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/authUser.js';
//const client_domain = process.env.CLIENT_DOMAIN
const client_domain =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_CLIENT_DOMAIN
    : process.env.DEV_CLIENT_DOMAIN;
    console.log("Running in NODE_ENV:", process.env.NODE_ENV);
    console.log("Using client domain:", client_domain);
    
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
router.post('/create-checkout-session', authUser, async (req, res, next) => {
    try {
        console.log(" Stripe Checkout Body:", req.body)
        const { products ,bookingId } = req.body;

        // Map the products into line items for Stripe checkout session
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product?.name || "Movie Ticket",
                },
                unit_amount: Math.round(product?.price * 100), 
            },
            quantity: 1,
        }));
   
        const successUrl = `${client_domain}/user/payment/success/${bookingId}?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${client_domain}/user/payment/cancel`;

        // Log the success URL
        console.log("Stripe success_url is:", successUrl);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: successUrl,
  
            cancel_url: cancelUrl,
            //console.log("Stripe success_url is:", successUrl),
            metadata: {
                showId: products[0]?.showId,
                theaterId: products[0]?.theaterId,
                selectedSeats: JSON.stringify(products[0]?.selectedSeats),
                date: products[0]?.date,
                timeSlot: products[0]?.timeSlot,
                userId: products[0]?.userId,
              },
                
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: "Internal server error", error: error.message });
    }
});
// check payment status
router.get("/session-status",async (req,res)=>{
    try{
        const sessionId = req.query.sessionId;
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        res.send({
            status:session?.status,
            customer_email:session?.customer_details?.email,
            session_data:session,
        })
    }  catch(error){
        res.status(error?.statusCode || 500).json(error.messsage||"internal server error")
    } 
})
export { router as paymentRouter };
