import mongoose from "mongoose";

// Define the schema for Payment
const PaymentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // Reference to the Booking model
    required: true,
  },
  amount: {
    type: Number, // Total amount paid
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'], // Example of payment methods
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending', // Payment status
  },
  paymentDate: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  transactionId: {
    type: String, // Transaction ID from the payment gateway (like Stripe, PayPal, etc.)
    required: true,
  },
  refundStatus: { 
    type: String, 
    enum: ['not_refunded', 'refunded'],
     default: 'not_refunded'
     },  // Refund status
  refundTransactionId: { 
    type: String, 
    default: '' 
  },  // Refund transaction ID (if applicable)
  refundAmount: { 
    type: Number, 
    default: 0 
  },  // Refund amount (if applicable)
  refundDate: { 
    type: Date, 
    default: null
   }, 
 
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});


export const Payment = mongoose.model('Payment',PaymentSchema);