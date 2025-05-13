
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null); // To store error messages

  useEffect(() => {
    const fetchSessionStatus = async () => {
      if (!sessionId) {
        setLoading(false);
        setPaymentStatus("error");
        setErrorMessage("Session ID is missing.");
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/payment/session-status?sessionId=${sessionId}`);
        console.log("Stripe session status:", data);
        
        if (data?.status === "complete") {
          setPaymentStatus("complete");
        } else {
          setPaymentStatus("open");
        }
      } catch (error) {
        console.error("Error fetching payment status", error);
        setPaymentStatus("error");
        setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
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
        <>
          <h1>❌ Payment Failed or Invalid</h1>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;

