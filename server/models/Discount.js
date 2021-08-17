/**
 * import modules
 */

 const mongoose = require("mongoose");

 //------------------------------------------------------------------------
 
 /**
  * define schema
  */
 
 // discount schema
 const discount = mongoose.Schema(
     {
        merchant: {
			type: mongoose.Types.ObjectId,
			ref: "merchant",
			required: true,
		},
        expireAt:{
            type: Number,
            required: true,
        },
        discount: {
             type: Number,
             required: true
        },
        total:{
            type: Number,
             required: true
        },
        noOfScan:{
            type: Number,
             required: true
        },
        updatedAt: {
             type: Number,
         },
        createdAt: {
             type: Number,
         },
     },
     {
         timestamps: {
             currentTime: () => Date.now(),
         },
     }
 );
 
 //------------------------------------------------------------------------
 
 /**
  * Create a model
  */
 
 const Discount = new mongoose.model("discount", discount);
 
 //------------------------------------------------------------------------
 
 /**
  * export modules
  */
 
 module.exports = Discount;
 