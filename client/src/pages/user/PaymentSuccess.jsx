import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const { data } = await axiosInstance.get(`/payment/session-status?sessionId=${sessionId}`);
        console.log("Stripe session status:", data);
        setPaymentStatus(data.status); // Stripe returns 'complete' if successful
      } catch (error) {
        console.error("Error fetching payment status", error);
        setPaymentStatus("error");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionStatus();
    } else {
      setLoading(false);
      setPaymentStatus("error");
    }
  }, [sessionId]);

  if (loading) return <h2 className="text-center mt-5">⏳ Verifying your payment...</h2>;

  return (
    <div className="text-center mt-5">
      {paymentStatus === "complete" ? (
        <>
          <h1>🎉 Payment Successful!</h1>
          <p>Thank you for your booking. Enjoy your movie! 🍿</p>
        </>
      ) : paymentStatus === "open" ? (
        <h1>🔄 Payment is still pending...</h1>
      ) : (
        <h1>❌ Payment Failed or Invalid</h1>
      )}
    </div>
  );
};

export default PaymentSuccess;
