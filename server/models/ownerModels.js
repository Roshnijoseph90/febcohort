import mongoose from 'mongoose'; 

const ownerSchema = new mongoose.Schema({
    name:{
      type:String,
    required:true,
     trim:true
    },
 email: {
    type: String,
    required: true,   
    unique: true, 
    trim:true  ,  
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
    enum:['admin','owner'],
    default:'owner'

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



export const Owner = mongoose.model('Owner', ownerSchema);
