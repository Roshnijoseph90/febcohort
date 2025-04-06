import React from 'react'
import useFetch from '../../hooks/useFetch'
import { loadStripe } from '@stripe/stripe-js';  // Corrected the case

import axios from 'axios'
import MoviesDetails from './MoviesDetails'
//import { Session } from 'node:inspector'

const BookingPage = () => {
  
  const [BookingData, isLoading, error] = useFetch("/booking/create-booking")
  const errorMessage = error?.response?.data?.message || "Unable to book ticket"
  const makePayment = async()=>{
    try{
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_publishable_key)
      const session = await axios({
        url:"/payment/create-checkout-session",
        method:"POST",
        data:{products:BookingData?.movies},
      })
      console.log(session,"====session")
      const result = stripe.redirectToCheckout({
         sessionId:session.data.sessionId,
      })
    }catch(error){
      console.log(error)
    }
  }

  
  // Log data for debugging purposes
  console.log("==== BookingData", BookingData)
  console.log("Error Message:", errorMessage)
  
  
  if (error) return <p>{errorMessage}</p>
  
  // Render booking data (if available)
  return (
    <div>
      <div className='w-4/12 flex text-center bg-secondary'>
        <h1>Payment Details</h1>
      </div>
      <button className='btn btn-success' onClick={makePayment}>Check Out</button>
      
      
    </div>
  )
}

export default BookingPage
