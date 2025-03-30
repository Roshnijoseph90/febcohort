import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
      type:String,
    required:true,
    minlength:3,
    maxlength:100
},
email: {
    type: String,
    required: true,   
    unique: true,     
    lowercase: true,  
  
  },
  mobile:{
    type:String,
    required:true,
    unique: true
   
  },
  role:{
    type:String,
    required:true,
    enum:['admin','user',' owner'],
    default:'user'

  },
  location: {
    type: String,  // Store city or country name
    required: true
  },
  profile_pic: {
    type: String, 
    default: 'https://www.example.com/default-profile-pic.png'
  },
  isActive:{
   type:Boolean,
   default:true,

  },
  password: { 
    type: String, 
    required: true 
  },
  resetToken: 
  { type: String },

  resetTokenExpiration: 
  { type: Date },
},{
  timestamps:true,
});



export const User = mongoose.model('User', userSchema);
