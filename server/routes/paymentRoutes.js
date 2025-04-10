import express from 'express';
const router = express.Router();
import { authUser } from '../middlewares/authUser.js';
const client_domain = process.env.CLIENT_DOMAIN;
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...'); 
router.post('/create-checkout-session', authUser, async (req, res, next) => {
    try {
        const { products } = req.body;

        // Map the products into line items for Stripe checkout session
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product?.movieId?.name, 
                },
                unit_amount: Math.round(product?.movieId?.price * 100), 
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${client_domain}/user/payment/success`,  
            cancel_url: `${client_domain}/user/payment/cancel`,
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
