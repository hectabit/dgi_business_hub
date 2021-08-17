/**
 * import modules
 */

 const mongoose = require("mongoose");

 //------------------------------------------------------------------------
 
 /**
  * define schema
  */
 
 // giftCard schema
 const giftCard = mongoose.Schema(
     {
        user: {
			type: String,
			required: true,
		},
        giftCards: [{
			discount:{
                type: mongoose.Types.ObjectId,
                ref: "discount",
                default:[]
            },
            used:{
                type:Boolean,
                default:false
            },
            code:{
                type:String,
                required:true
            }
		}],
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
 
 const GiftCard = new mongoose.model("giftcard", giftCard);
 
 //------------------------------------------------------------------------
 
 /**
  * export modules
  */
 
 module.exports = GiftCard;
 