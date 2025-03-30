import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin'],  
    default: 'admin',  // Default role is admin
  },
  isActive: {
    type: Boolean,
    default: true,  
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: 
  { type: String },

  resetTokenExpiration: 
  { type: Date },
}, {
  timestamps: true,
});

export const Admin = mongoose.model('Admin', adminSchema);
