/**
 * import modules
 */

 const mongoose = require("mongoose");

 //------------------------------------------------------------------------
 
 /**
  * define schema
  */
 
 // user schema
 const loginSchema = mongoose.Schema({
     jwt: {
         type: String,
         required: true,
     },
     createdAt: {
         type: Date,
         default: Date.now,
         expires: 14400, // auto delete in four hours
     },
     userType: {
         type: Number,
         enum: [0, 1],
         required: true,
     },
     refNo: {
         type: String,
         required: true,
         unique: true,
     },
 });
 
 //------------------------------------------------------------------------
 
 /**
  * Create a model
  */
 
 const Login = new mongoose.model("login", loginSchema);
 
 //------------------------------------------------------------------------
 
 /**
  * export modules
  */
 
 module.exports = Login;
 